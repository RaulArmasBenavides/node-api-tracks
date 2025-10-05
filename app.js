require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { dbConnect } = require("./app/database/mongo");
const { swaggerDocs: V1SwaggerDocs } = require("./app/swagger");

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1", require("./app/routes"));
dbConnect();
app.listen(PORT, () => {
  console.log(`Tu API es http://localhost:${PORT}/api/v1`);
  console.log(`Version 1 Docs: http://localhost:${PORT}/api/v1/docs`);
  V1SwaggerDocs(app, PORT);
});
