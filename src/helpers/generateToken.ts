// src/helpers/generateToken.ts
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/** Asegúrate de definir JWT_SECRET en tu .env */
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

/** Usuario mínimo para firmar token corto */
export type UserLike = {
  _id: string;
  role?: string;
};

/** Payloads */
export type ShortTokenPayload = { _id: string; role?: string };
export type UidPayload = { uid: string };

/** Genera un token (2h) con _id/role */
export async function tokenSign(user: UserLike): Promise<string> {
  const payload: ShortTokenPayload = { _id: user._id, role: user.role };
  const options: SignOptions = { expiresIn: "2h" };
  return jwt.sign(payload, JWT_SECRET??'', options);
}

/** Genera un JWT (12h) con solo uid — equivalente a tu generarJWT */
export function generarJWT(uid: string): Promise<string> {
  const payload: UidPayload = { uid };
  const options: SignOptions = { expiresIn: "12h" };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET??'', options, (err, token) => {
      if (err || !token) {
        console.error(err);
        return reject("No se pudo generar el JWT");
      }
      resolve(token);
    });
  });
}

/** Verifica un token y devuelve el payload tipado o null si es inválido/expirado */
export async function verifyToken<T extends JwtPayload | string = JwtPayload>(
  token: string
): Promise<T | null> {
  try {
    return jwt.verify(token, JWT_SECRET??'') as T;
  } catch {
    return null;
  }
}

/** Decodifica sin verificar (útil solo para debug) */
export function decodeSign(
  token: string
): null | string | JwtPayload {
  return jwt.decode(token, { json: true }) as null | JwtPayload; // json:true -> objeto si es JSON
}

export default { tokenSign, generarJWT, verifyToken, decodeSign };
