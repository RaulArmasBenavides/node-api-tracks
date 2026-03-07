import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';
dotenv.config();

export const ConfigJWT = {
  keySecretToken: process.env.JWT_SECRET,
  expirit: '1d',
};

export class JwtAdapter {

  static generateToken(
    payload: any,
    duration: SignOptions['expiresIn'] = '2h'   // 👈 tipo basado en la lib
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        ConfigJWT.keySecretToken!,               // tu secret
        { expiresIn: duration },                 // 👈 ahora matchea el tipo
        (err, token) => {
          if (err || !token) {
            // opcional: console.error('JWT sign error:', err);
            return resolve(null);
          }
          resolve(token);
        },
      );
    });
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, ConfigJWT.keySecretToken!, (err, decoded) => {
        if (err) return resolve(null);

        resolve(decoded as T);
      });
    });
  }
}
