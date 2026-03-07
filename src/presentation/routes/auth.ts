// src/routes/auth.ts
import { Router } from "express";
import { check } from "express-validator";
import { login, crearUsuario, googleSignIn } from "../controllers/auth"; // si tu carpeta aún es 'controlles', cambia a ../controlles/auth
import validarCampos from "../middleware/validar-campos";

const router = Router();

router.post("/login", login);

router.post(
  "/register",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/google",
  [
    check("token", "El token de Google es obligatorio").not().isEmpty(),
    // validarCampos // si quieres validar también la cadena de validaciones
  ],
  googleSignIn
);

export default router;
