"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
// src/models/users.ts
const mongoose_1 = require("mongoose");
/**
 * Esquema de Mongoose con tipos estrictos
 */
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
}, {
    timestamps: true,
    versionKey: false,
});
/**
 * Exporta el modelo de usuario
 */
exports.UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.default = exports.UserModel;
