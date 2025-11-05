// src/helpers/validateHelper.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Verifica los resultados de validación de express-validator.
 * Si existen errores, responde con status 403 y un arreglo de errores.
 */
export function validateResult(req: Request, res: Response, next: NextFunction): void {
  try {
    validationResult(req).throw();
    next();
  } catch (err: any) {
    res.status(403).json({
      errors: err.array ? err.array() : [{ msg: "Error de validación desconocido" }],
    });
  }
}

export default { validateResult };
