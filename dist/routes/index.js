"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/routes/index.ts
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const tracks_1 = __importDefault(require("./tracks"));
const router = (0, express_1.Router)();
// monta rutas explícitas
router.use("/auth", auth_1.default); // -> /api/.../auth/*
router.use("/tracks", tracks_1.default); // -> /api/.../tracks/*
// 404 para cualquier otra ruta de este router
router.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});
exports.default = router;
