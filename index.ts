// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

 
import { swaggerDocs as V1SwaggerDocs } from "./src/swagger";
import routes from "./src/routes";

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve("public")));

app.use("/api/v1", routes);

// dbConnect();

app.listen(PORT, () => {
  console.log(`Tu API es http://localhost:${PORT}/api/v1`);
  console.log(`Version 1 Docs: http://localhost:${PORT}/api/v1/docs`);
  V1SwaggerDocs(app, PORT);
});
