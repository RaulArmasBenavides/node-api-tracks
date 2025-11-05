"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_path_1 = __importDefault(require("node:path"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_1 = require("./swagger");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT ?? 3000);
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.json());
app.use(express_1.default.static(node_path_1.default.resolve("public")));
app.use("/api/v1", routes_1.default);
// dbConnect();
app.listen(PORT, () => {
    console.log(`Tu API es http://localhost:${PORT}/api/v1`);
    console.log(`Version 1 Docs: http://localhost:${PORT}/api/v1/docs`);
    (0, swagger_1.swaggerDocs)(app, PORT);
});
