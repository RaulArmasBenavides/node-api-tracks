"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpError = httpError;
/**
 * Envía una respuesta estándar de error 500 al cliente.
 * @param res - Objeto Response de Express
 * @param err - Error o mensaje a registrar
 */
function httpError(res, err) {
    console.error(err);
    res.status(500).json({ error: "Algo ocurrió" });
}
exports.default = { httpError };
