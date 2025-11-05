"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRoleAuth = checkRoleAuth;
const users_1 = __importDefault(require("../models/users"));
const generateToken_1 = require("../helpers/generateToken");
function checkRoleAuth(roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return async (req, res, next) => {
        try {
            const auth = req.headers.authorization ?? "";
            if (!auth || !auth.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Missing or invalid Authorization header" });
            }
            const token = auth.slice(7).trim();
            if (!token) {
                return res.status(401).json({ error: "Token not provided" });
            }
            const tokenData = (await (0, generateToken_1.verifyToken)(token));
            if (!tokenData) {
                return res.status(401).json({ error: "Invalid token" });
            }
            const userId = tokenData._id ?? tokenData.id;
            if (!userId) {
                return res.status(401).json({ error: "Token without user id" });
            }
            const user = (await users_1.default.findById(userId));
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            const hasRole = user.role ? allowed.includes(user.role) : false;
            if (!hasRole) {
                return res.status(403).json({ error: "No tienes permisos" });
            }
            // opcional: exponer usuario/rol al siguiente handler
            req.user = { id: user.id, role: user.role };
            return next();
        }
        catch (e) {
            console.error(e);
            return res.status(401).json({ error: "Tu por aqui no pasas!" });
        }
    };
}
exports.default = checkRoleAuth;
