"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSign = tokenSign;
exports.generarJWT = generarJWT;
exports.verifyToken = verifyToken;
exports.decodeSign = decodeSign;
// src/helpers/generateToken.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/** Asegúrate de definir JWT_SECRET en tu .env */
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
}
/** Genera un token (2h) con _id/role */
async function tokenSign(user) {
    const payload = { _id: user._id, role: user.role };
    const options = { expiresIn: "2h" };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET ?? '', options);
}
/** Genera un JWT (12h) con solo uid — equivalente a tu generarJWT */
function generarJWT(uid) {
    const payload = { uid };
    const options = { expiresIn: "12h" };
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, JWT_SECRET ?? '', options, (err, token) => {
            if (err || !token) {
                console.error(err);
                return reject("No se pudo generar el JWT");
            }
            resolve(token);
        });
    });
}
/** Verifica un token y devuelve el payload tipado o null si es inválido/expirado */
async function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET ?? '');
    }
    catch {
        return null;
    }
}
/** Decodifica sin verificar (útil solo para debug) */
function decodeSign(token) {
    return jsonwebtoken_1.default.decode(token, { json: true }); // json:true -> objeto si es JSON
}
exports.default = { tokenSign, generarJWT, verifyToken, decodeSign };
