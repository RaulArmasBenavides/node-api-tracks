"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
// src/models/categories.ts
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
// Equivalente a method('toJSON') de tu JS, quitando __v.
CategorySchema.set("toJSON", {
    versionKey: false,
    transform: (_doc, ret) => {
        // en tu código original sólo removías __v (ya está deshabilitado arriba),
        // si quisieras también podrías convertir _id -> id:
        // ret.id = ret._id;
        // delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.CategoryModel = (0, mongoose_1.model)("categories", CategorySchema);
exports.default = exports.CategoryModel;
