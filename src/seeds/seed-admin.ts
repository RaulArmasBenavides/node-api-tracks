// Crea (o actualiza) el usuario administrador a partir de variables de entorno.
// Uso: npm run seed:admin
import 'dotenv/config';
import mongoose from 'mongoose';
import UserModel from '../models/users.model';
import { encrypt } from '../helpers/handleBcrypt';
import { Uuid } from '../configs/uuid.adapter';

async function seedAdmin(): Promise<void> {
  const uri = process.env.DB_CNN ?? process.env.MONGO_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!uri) throw new Error('Falta DB_CNN (o MONGO_URL) en .env');
  if (!email || !password) throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD en .env');

  await mongoose.connect(uri);
  try {
    const passwordHash = await encrypt(password);
    const existing = await UserModel.findOne({ email });

    if (existing) {
      existing.role = 'ADMIN_ROLE';
      existing.password = passwordHash;
      await existing.save();
      console.log(`[seed] Admin actualizado: ${email}`);
    } else {
      await UserModel.create({
        id: Uuid.v4(),
        name,
        email,
        password: passwordHash,
        role: 'ADMIN_ROLE',
      });
      console.log(`[seed] Admin creado: ${email}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin().catch((err) => {
  console.error('[seed] Error:', err.message ?? err);
  process.exit(1);
});
