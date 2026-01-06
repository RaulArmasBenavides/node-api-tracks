// src/middleware/checkRoleAuth.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
 
import UserModel from "../models/users";
import { verifyToken } from "../helpers/generateToken";
import { JwtPayload } from "../types/jwt.type";
import { IUser } from "../interfaces/user.interface";


export function checkRoleAuth(roles: string[] | string): RequestHandler {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.headers.authorization ?? "";
      if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
      }

      const token = auth.slice(7).trim();
      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }

      const tokenData = (await verifyToken(token)) as JwtPayload | undefined;
      if (!tokenData) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const userId = tokenData._id ?? tokenData.id;
      if (!userId) {
        return res.status(401).json({ error: "Token without user id" });
      }

      const user = (await UserModel.findById(userId)) as (IUser | null);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const hasRole = user.role ? allowed.includes(user.role) : false;
      if (!hasRole) {
        return res.status(403).json({ error: "No tienes permisos" });
      }

      // opcional: exponer usuario/rol al siguiente handler
      (req as any).user = { id: user.id, role: user.role };
      return next();
    } catch (e) {
      console.error(e);
      return res.status(401).json({ error: "Tu por aqui no pasas!" });
    }
  };
}

export default checkRoleAuth;
