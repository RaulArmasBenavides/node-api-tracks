"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const generateToken_1 = require("../helpers/generateToken");
// Ajusta este tipo al payload real que emites en tu JWT
async function checkAuth(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing or invalid Authorization header" });
        }
        const token = auth.slice(7).trim(); // quita "Bearer "
        if (!token) {
            return res.status(401).json({ error: "Token not provided" });
        }
        // verifyToken debe lanzar si el token es inválido/expirado
        const tokenData = (await (0, generateToken_1.verifyToken)(token));
        if (!tokenData) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // opcional: adjuntamos el payload al request
        //req.user = tokenData;
        return next();
    }
    catch (e) {
        console.error(e);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
exports.default = checkAuth;
