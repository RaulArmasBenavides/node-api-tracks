"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = swaggerDocs;
const node_path_1 = __importDefault(require("node:path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// --- Metadata de la API ---
const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "Spotify API", version: "1.0.0" },
    },
    // Incluye rutas tanto en src (.ts) como en dist (.js) para dev y prod
    apis: [
        // Dev (TS)
        node_path_1.default.resolve("src/app/routes/*.ts"),
        node_path_1.default.resolve("src/app/database/*.ts"),
        // Prod (JS compilado)
        node_path_1.default.resolve("dist/app/routes/*.js"),
        node_path_1.default.resolve("dist/app/database/*.js"),
    ],
};
// Docs en JSON
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Configurar endpoints de docs
function swaggerDocs(app, port) {
    app.use("/api/v1/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/api/v1/docs.json", (_req, res) => {
        res.type("application/json").send(swaggerSpec);
    });
    console.log(`Version 1 Docs are available at http://localhost:${port}/api/v1/docs`);
}
exports.default = { swaggerDocs };
