// src/app/swagger.ts
import type { Express } from "express";
import path from "node:path";
import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// --- Metadata de la API ---
const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Spotify API", version: "1.0.0" },
  },
  // Incluye rutas tanto en src (.ts) como en dist (.js) para dev y prod
  apis: [
    // Dev (TS)
    path.resolve("src/app/routes/*.ts"),
    path.resolve("src/app/database/*.ts"),
    // Prod (JS compilado)
    path.resolve("dist/app/routes/*.js"),
    path.resolve("dist/app/database/*.js"),
  ],
};

// Docs en JSON
const swaggerSpec = swaggerJSDoc(options);

// Configurar endpoints de docs
export function swaggerDocs(app: Express, port: number): void {
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get("/api/v1/docs.json", (_req, res) => {
    res.type("application/json").send(swaggerSpec);
  });

  console.log(`Version 1 Docs are available at http://localhost:${port}/api/v1/docs`);
}

export default { swaggerDocs };
