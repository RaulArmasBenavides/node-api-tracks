// src/presentation/middleware/requireUser.ts
// Exige un JWT válido (emitido por /auth/login) y deja el ID de usuario en res.locals.userId.
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../../helpers/generateToken';

export async function requireUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const payload = await verifyToken<JwtPayload>(auth.slice(7).trim());
  if (!payload || typeof payload.uid !== 'string') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  res.locals.userId = payload.uid;
  next();
}

export default requireUser;
