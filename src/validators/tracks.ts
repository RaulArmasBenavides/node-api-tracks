// src/validators/tracks.ts
import { type Request, type Response, type NextFunction, type RequestHandler } from "express";
import { check, type ValidationChain } from "express-validator";
import { validateResult } from "../helpers/validateHelper";

/**
 * Valida creación de track: name y url requeridos, el resto opcional.
 * album, cover: string si se envían
 * artist.name: string si se envía
 * duration.start, duration.end: números si se envían
 */
export const validateCreateTrack: (ValidationChain | RequestHandler)[] = [
  check("name")
    .exists().withMessage("name es requerido")
    .bail()
    .isString().withMessage("name debe ser string")
    .notEmpty().withMessage("name no puede estar vacío"),

  check("url")
    .exists().withMessage("url es requerido")
    .bail()
    .isString().withMessage("url debe ser string")
    .notEmpty().withMessage("url no puede estar vacío"),

  check("album")
    .optional()
    .isString().withMessage("album debe ser string"),

  check("cover")
    .optional()
    .isString().withMessage("cover debe ser string"),

  check("artist.name")
    .optional()
    .isString().withMessage("artist.name debe ser string"),

  check("duration.start")
    .optional()
    .isNumeric().withMessage("duration.start debe ser número"),

  check("duration.end")
    .optional()
    .isNumeric().withMessage("duration.end debe ser número"),

  // middleware final que usa tu helper
  (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next),
];

/**
 * Valida actualización parcial (PATCH) de track:
 * todos los campos son opcionales, pero si se envían deben ser del tipo correcto.
 */
export const validateUpdateTrack: (ValidationChain | RequestHandler)[] = [
  check("name")
    .optional()
    .isString().withMessage("name debe ser string")
    .notEmpty().withMessage("name no puede estar vacío"),

  check("url")
    .optional()
    .isString().withMessage("url debe ser string")
    .notEmpty().withMessage("url no puede estar vacío"),

  check("album")
    .optional()
    .isString().withMessage("album debe ser string"),

  check("cover")
    .optional()
    .isString().withMessage("cover debe ser string"),

  check("artist.name")
    .optional()
    .isString().withMessage("artist.name debe ser string"),

  check("duration.start")
    .optional()
    .isNumeric().withMessage("duration.start debe ser número"),

  check("duration.end")
    .optional()
    .isNumeric().withMessage("duration.end debe ser número"),

  // middleware final que usa tu helper
  (req: Request, res: Response, next: NextFunction) => validateResult(req, res, next),
];

export default { validateCreateTrack, validateUpdateTrack };
