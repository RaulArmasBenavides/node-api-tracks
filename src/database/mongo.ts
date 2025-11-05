import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
  const uri = process.env.DB_CNN;
  if (!uri) {
    throw new Error("Missing DB_CNN environment variable");
  }

  // Evita warnings con queries no estrictas
  mongoose.set("strictQuery", true);

  // No reconectar si ya está conectando/conectado
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  console.log("[db] Conectando a Mongo...");
  await mongoose.connect(uri);
  console.log("[db] Mongo conectado");
}