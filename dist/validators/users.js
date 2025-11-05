"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreate = void 0;
const express_validator_1 = require("express-validator");
const validateHelper_1 = require("../helpers/validateHelper");
/**
 * Valida creación de usuario: name, age, email
 */
exports.validateCreate = [
    (0, express_validator_1.check)("name")
        .exists().withMessage("name es requerido")
        .bail()
        .isString().withMessage("name debe ser string")
        .notEmpty().withMessage("name no puede estar vacío")
        .isLength({ min: 5 }).withMessage("name debe tener al menos 5 caracteres"),
    (0, express_validator_1.check)("age")
        .exists().withMessage("age es requerido")
        .bail()
        .isInt({ min: 18, max: 40 }).withMessage("Rango de edad debe ser entre 18 y 40")
        .toInt(),
    (0, express_validator_1.check)("email")
        .exists().withMessage("email es requerido")
        .bail()
        .isEmail().withMessage("email no es válido")
        .normalizeEmail(),
    // middleware final que usa tu helper
    (req, res, next) => (0, validateHelper_1.validateResult)(req, res, next),
];
exports.default = exports.validateCreate;
