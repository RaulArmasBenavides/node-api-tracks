import type { Express } from "express";
import path from "node:path";
import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spotify API",
      version: "1.0.0",
    },
  },
  apis: [
    path.resolve("src/routes/*.ts"),
    path.resolve("src/controllers/*.ts"),

    path.resolve("dist/routes/*.js"),
    path.resolve("dist/controllers/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export function swaggerDocs(app: Express, port: number): void {
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get("/api/v1/docs.json", (_req, res) => {
    res.type("application/json").send(swaggerSpec);
  });

  console.log(`Docs: http://localhost:${port}/api/v1/docs`);
}