"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCampos = validarCampos;
const express_validator_1 = require("express-validator");
function validarCampos(req, res, next) {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped(), // { campo: { msg, param, location, ... } }
        });
    }
    return next();
}
exports.default = validarCampos;
