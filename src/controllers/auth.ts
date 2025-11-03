// src/controllers/auth.ts
import { Request, Response } from "express";
import { httpError } from "../helpers/handleError";
import { encrypt, compare } from "../helpers/handleBcrypt";
 
import { getMenuFrontEnd } from "../helpers/menu-frontend";
// Ajusta este import a la ruta real donde tengas la verificación de Google

import userModel from "../models/users"; // requiere esModuleInterop=true
import googleVerify from "../helpers/google-verify";
import { generarJWT, tokenSign } from "../helpers/generateToken";

// === Tipos locales ===
type LoginBody = { email: string; password: string };
type CreateUserBody = { email: string; password: string; name: string; age?: number; role?: string };
type GoogleSignInBody = { token: string };

type UserJwtPayload = {
  id: string;
  email?: string;
  role?: string;
};

type UserDoc = {
  id: string;
  _id?: string;
  email: string;
  password: string;
  name?: string;
  age?: number;
  role?: string;
  google?: boolean;
  img?: string;
  save?: () => Promise<void>;
} & Record<string, unknown>;

// === Controladores ===

// Demo/mock login (mantiene tu lógica original con mock)
export const loginCtrl = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const mockUser = {
      name: "Leifer",
      email: "test@test.com",
      password: "12345678",
      avatar: "https://i.imgur.com/0mZ4PUR.png",
    };

    const { email, password } = req.body;

    if (mockUser.email !== email) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const checkPassword = mockUser.password === password;

    // JWT
    const tokenSession = await tokenSign(mockUser as any);

    if (checkPassword) {
      res.send({
        data: mockUser,
        tokenSession,
      });
      return;
    }

    res.status(409).send({ error: "Invalid password" });
  } catch (e) {
    httpError(res, e);
  }
};

// Login real contra base de datos
export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const usuarioDB = (await userModel.findOne({ email })) as UserDoc | null;
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    const validPassword = await compare(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB.id);

    return res.json({
      ok: true,
      token,
      usuarioDB,
      menu: getMenuFrontEnd(usuarioDB.role),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// Crear usuario
export const crearUsuario = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  try {
    const { email, password, name, age, role } = req.body;

    const existeEmail = await userModel.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const passwordHash = await encrypt(password);

    const registerUser = await userModel.create({
      email,
      name,
      age,
      role,
      password: passwordHash,
    });

    res.send({ data: registerUser });
  } catch (e) {
    httpError(res, e);
  }
};

// Login con Google
export const googleSignIn = async (req: Request<{}, {}, GoogleSignInBody>, res: Response) => {
  const { token: googleToken } = req.body;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = (await userModel.findOne({ email })) as UserDoc | null;
    let usuario: UserDoc;

    if (!usuarioDB) {
      // no existe: crear
      usuario = new userModel({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      }) as any;
    } else {
      // existe
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar en DB
    if (typeof usuario.save === "function") {
      await usuario.save();
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      token,
      usuarioDB: usuarioDB ?? usuario,
      menu: getMenuFrontEnd(usuario.role),
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token no es correcto",
    });
  }
};

export default { loginCtrl, crearUsuario, googleSignIn, login };
