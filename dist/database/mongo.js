"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = dbConnect;
const mongoose_1 = __importDefault(require("mongoose"));
async function dbConnect() {
    const uri = process.env.DB_CNN;
    if (!uri) {
        throw new Error('Missing DB_CNN environment variable');
    }
    // Evita warnings con queries no estrictas
    mongoose_1.default.set('strictQuery', true);
    // No reconectar si ya está conectando/conectado
    if (mongoose_1.default.connection.readyState === 1 ||
        mongoose_1.default.connection.readyState === 2) {
        return;
    }
    console.log('[db] Conectando a Mongo...');
    await mongoose_1.default.connect(uri);
    console.log('[db] Mongo conectado');
}
