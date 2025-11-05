// src/helpers/handleError.ts
import { Response } from "express";

/**
 * Envía una respuesta estándar de error 500 al cliente.
 * @param res - Objeto Response de Express
 * @param err - Error o mensaje a registrar
 */
export function httpError(res: Response, err: unknown): void {
  console.error(err);
  res.status(500).json({ error: "Algo ocurrió" });
}

export default { httpError };
