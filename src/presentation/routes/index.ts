// src/app/routes/index.ts
import { Router } from "express";
import authRouter from "./auth";
import tracksRouter from "./tracks";
import libraryRouter from "./library";

const router = Router();

// monta rutas explícitas
router.use("/auth", authRouter);     // -> /api/.../auth/*
router.use("/tracks", tracksRouter); // -> /api/.../tracks/*
router.use("/me", libraryRouter);    // -> /api/.../me/* (playlists y me gusta, JWT requerido)

// 404 para cualquier otra ruta de este router
router.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default router;
