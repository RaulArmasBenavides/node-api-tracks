// src/helpers/handleBcrypt.ts
import bcrypt from "bcryptjs";

/**
 * Encripta texto plano con bcrypt (10 salt rounds por defecto)
 */
export async function encrypt(textPlain: string): Promise<string> {
  const hash = await bcrypt.hash(textPlain, 10);
  return hash;
}

/**
 * Compara una contraseña en texto plano contra un hash bcrypt
 */
export async function compare(passwordPlain: string, hashPassword: string): Promise<boolean> {
  return bcrypt.compare(passwordPlain, hashPassword);
}

export default { encrypt, compare };
