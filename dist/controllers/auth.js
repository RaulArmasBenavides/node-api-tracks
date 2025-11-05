"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSignIn = exports.crearUsuario = exports.login = exports.loginCtrl = void 0;
const handleError_1 = require("../helpers/handleError");
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const menu_frontend_1 = require("../helpers/menu-frontend");
// Ajusta este import a la ruta real donde tengas la verificación de Google
const users_1 = __importDefault(require("../models/users")); // requiere esModuleInterop=true
const google_verify_1 = __importDefault(require("../helpers/google-verify"));
const generateToken_1 = require("../helpers/generateToken");
// === Controladores ===
// Demo/mock login (mantiene tu lógica original con mock)
const loginCtrl = async (req, res) => {
    try {
        const mockUser = {
            name: 'Leifer',
            email: 'test@test.com',
            password: '12345678',
            avatar: 'https://i.imgur.com/0mZ4PUR.png',
        };
        const { email, password } = req.body;
        if (mockUser.email !== email) {
            res.status(404).send({ error: 'User not found' });
            return;
        }
        const checkPassword = mockUser.password === password;
        // JWT
        const tokenSession = await (0, generateToken_1.tokenSign)(mockUser);
        if (checkPassword) {
            res.send({
                data: mockUser,
                tokenSession,
            });
            return;
        }
        res.status(409).send({ error: 'Invalid password' });
    }
    catch (e) {
        (0, handleError_1.httpError)(res, e);
    }
};
exports.loginCtrl = loginCtrl;
// Login real contra base de datos
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuarioDB = (await users_1.default.findOne({ email }));
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }
        const validPassword = await (0, handleBcrypt_1.compare)(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida',
            });
        }
        // Generar el TOKEN - JWT
        const token = await (0, generateToken_1.generarJWT)(usuarioDB.id);
        return res.json({
            ok: true,
            token,
            usuarioDB,
            menu: (0, menu_frontend_1.getMenuFrontEnd)('USER_ROLE'),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};
exports.login = login;
// Crear usuario
const crearUsuario = async (req, res) => {
    try {
        const { email, password, name, age, role } = req.body;
        const existeEmail = await users_1.default.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }
        const passwordHash = await (0, handleBcrypt_1.encrypt)(password);
        const registerUser = await users_1.default.create({
            email,
            name,
            age,
            role,
            password: passwordHash,
        });
        res.send({ data: registerUser });
    }
    catch (e) {
        (0, handleError_1.httpError)(res, e);
    }
};
exports.crearUsuario = crearUsuario;
// Login con Google
const googleSignIn = async (req, res) => {
    const { token: googleToken } = req.body;
    try {
        const { name, email, picture } = await (0, google_verify_1.default)(googleToken);
        const usuarioDB = (await users_1.default.findOne({ email }));
        let usuario;
        if (!usuarioDB) {
            // no existe: crear
            usuario = new users_1.default({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true,
            });
        }
        else {
            // existe
            usuario = usuarioDB;
            usuario.google = true;
        }
        // Guardar en DB
        if (typeof usuario.save === 'function') {
            await usuario.save();
        }
        // Generar el TOKEN - JWT
        const token = await (0, generateToken_1.generarJWT)(usuario.id);
        res.json({
            ok: true,
            token,
            usuarioDB: usuarioDB ?? usuario,
            menu: (0, menu_frontend_1.getMenuFrontEnd)('USER_ROLE'),
        });
    }
    catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
};
exports.googleSignIn = googleSignIn;
exports.default = { loginCtrl: exports.loginCtrl, crearUsuario: exports.crearUsuario, googleSignIn: exports.googleSignIn, login: exports.login };
