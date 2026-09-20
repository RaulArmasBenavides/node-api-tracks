// src/app/routes/tracks.ts
import { Router } from "express";
import checkOrigin from "../middleware/origin";
import { getItems, getItem, createItem, deleteItem, updateItem } from "../controllers/tracks";
import { validateCreateTrack, validateUpdateTrack } from "../../validators/tracks";

const router = Router();

// GET: lista mock
router.get("/", getItems); // http://localhost:3001/api/1.0/tracks

// GET: por id (con origin-check)
router.get("/:id", checkOrigin, getItem);

// POST: crear (con validación de campos)
router.post("/", validateCreateTrack, createItem);

// PATCH: actualizar (con validación de campos)
router.patch("/:id", validateUpdateTrack, updateItem);

// DELETE: eliminar
router.delete("/:id", deleteItem);

export default router;
