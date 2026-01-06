// src/models/users.ts
import { Schema, model, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
export type UserRole = 'USER_ROLE' | 'ADMIN_ROLE';

/**
 * Esquema de Mongoose con tipos estrictos
 */
const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['USER_ROLE', 'ADMIN_ROLE'],
      default: 'USER_ROLE',
      required: false,
    },
    img: {
      type: String,
      required: false,
    },
    google: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users', // opcional: asegura el nombre de colección
  },
);

/**
 * Exporta el modelo de usuario
 */
export const UserModel = model<IUser>('users', UserSchema);

export default UserModel;
