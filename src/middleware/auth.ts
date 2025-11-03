// src/middleware/checkAuth.ts
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../helpers/generateToken";

// Ajusta este tipo al payload real que emites en tu JWT
 

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = auth.slice(7).trim(); // quita "Bearer "
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // verifyToken debe lanzar si el token es inválido/expirado
    const tokenData = (await verifyToken(token)) as JwtPayload | undefined;

    if (!tokenData) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // opcional: adjuntamos el payload al request
    //req.user = tokenData;

    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export default checkAuth;
