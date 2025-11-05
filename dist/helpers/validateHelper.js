"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = validateResult;
const express_validator_1 = require("express-validator");
/**
 * Verifica los resultados de validación de express-validator.
 * Si existen errores, responde con status 403 y un arreglo de errores.
 */
function validateResult(req, res, next) {
    try {
        (0, express_validator_1.validationResult)(req).throw();
        next();
    }
    catch (err) {
        res.status(403).json({
            errors: err.array ? err.array() : [{ msg: "Error de validación desconocido" }],
        });
    }
}
exports.default = { validateResult };
