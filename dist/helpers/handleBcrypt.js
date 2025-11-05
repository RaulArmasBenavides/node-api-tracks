"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.compare = compare;
// src/helpers/handleBcrypt.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Encripta texto plano con bcrypt (10 salt rounds por defecto)
 */
async function encrypt(textPlain) {
    const hash = await bcryptjs_1.default.hash(textPlain, 10);
    return hash;
}
/**
 * Compara una contraseña en texto plano contra un hash bcrypt
 */
async function compare(passwordPlain, hashPassword) {
    return bcryptjs_1.default.compare(passwordPlain, hashPassword);
}
exports.default = { encrypt, compare };
