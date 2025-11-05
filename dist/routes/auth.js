"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth"); // si tu carpeta aún es 'controlles', cambia a ../controlles/auth
const validar_campos_1 = __importDefault(require("../middleware/validar-campos"));
const router = (0, express_1.Router)();
router.post("/login", auth_1.login);
router.post("/register", [
    (0, express_validator_1.check)("email", "El email es obligatorio").isEmail(),
    (0, express_validator_1.check)("password", "El password es obligatorio").not().isEmpty(),
    validar_campos_1.default,
], auth_1.crearUsuario);
router.post("/google", [
    (0, express_validator_1.check)("token", "El token de Google es obligatorio").not().isEmpty(),
    // validarCampos // si quieres validar también la cadena de validaciones
], auth_1.googleSignIn);
exports.default = router;
