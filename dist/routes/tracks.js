"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app/routes/tracks.ts
const express_1 = require("express");
const origin_1 = __importDefault(require("../middleware/origin"));
const tracks_1 = require("../controllers/tracks");
const router = (0, express_1.Router)();
// GET: lista mock
router.get("/", tracks_1.getItems); // http://localhost:3001/api/1.0/tracks
// GET: por id (con origin-check)
router.get("/:id", origin_1.default, tracks_1.getItem);
// POST: crear (puedes activar validaciones si quieres)
router.post("/", /* checkOrigin, validateCreate, */ tracks_1.createItem);
// PATCH: actualizar
router.patch("/:id", tracks_1.updateItem);
// DELETE: eliminar
router.delete("/:id", tracks_1.deleteItem);
exports.default = router;
