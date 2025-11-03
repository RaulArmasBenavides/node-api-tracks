// src/validators/user.validator.ts
import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { check, type ValidationChain } from "express-validator";
import { validateResult } from "../helpers/validateHelper";

/**
 * Valida creación de usuario: name, age, email
 */
export const validateCreate: (ValidationChain | RequestHandler)[] = [
  check("name")
    .exists().withMessage("name es requerido")
    .bail()
    .isString().withMessage("name debe ser string")
    .notEmpty().withMessage("name no puede estar vacío")
    .isLength({ min: 5 }).withMessage("name debe tener al menos 5 caracteres"),

  check("age")
    .exists().withMessage("age es requerido")
    .bail()
    .isInt({ min: 18, max: 40 }).withMessage("Rango de edad debe ser entre 18 y 40")
    .toInt(),

  check("email")
    .exists().withMessage("email es requerido")
    .bail()
    .isEmail().withMessage("email no es válido")
    .normalizeEmail(),

  // middleware final que usa tu helper
  (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next),
];

export default validateCreate;
