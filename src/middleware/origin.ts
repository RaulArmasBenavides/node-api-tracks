// src/middleware/origin.ts
import { Request, Response, NextFunction } from "express";

export function checkOrigin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    if (token === "123456") {
      return next();
    }

    // No autorizado según tu lógica original
    return res.status(409).json({ error: "Tu por aqui no pasas!" });
  } catch (_e) {
    // si algo falla, continúa (igual que tu catch original)
    return next();
  }
}

export default checkOrigin;
