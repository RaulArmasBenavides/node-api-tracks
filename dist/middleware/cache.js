"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheInit = void 0;
// src/middlewares/cache.ts
const express_expeditious_1 = __importDefault(require("express-expeditious"));
// ⚙️ Configuración por defecto del caché
const defaultOptions = {
    namespace: 'expresscache',
    defaultTtl: '15 minutes', // También puedes usar: 15 * 60 * 1000
    statusCodeExpires: {
        404: '5 minutes',
        500: 0, // No cachea errores de servidor
    },
};
// 🧩 Inicializa el middleware de caché
exports.cacheInit = (0, express_expeditious_1.default)(defaultOptions);
exports.default = { cacheInit: exports.cacheInit };
