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
    role: {
        type: String,
        enum: ['USER_ROLE', 'ADMIN_ROLE'],
        default: 'USER_ROLE',
        required: true,
    },
    img: {
        type: String,
    },
    google: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: 'users', // opcional: asegura el nombre de colección
});
/**
 * Exporta el modelo de usuario
 */
exports.UserModel = (0, mongoose_1.model)('users', UserSchema);
exports.default = exports.UserModel;
