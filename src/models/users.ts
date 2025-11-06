// src/models/users.ts
import { Schema, model, Document } from 'mongoose';
export type UserRole = 'USER_ROLE' | 'ADMIN_ROLE';

/**
 * Interface TypeScript para tipar el documento de usuario
 */
export interface IUser extends Document {
  name: string;
  age?: number;
  email: string;
  password: string;
  img?: string;
  role: UserRole;
  google: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Esquema de Mongoose con tipos estrictos
 */
const UserSchema = new Schema<IUser>(
  {
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
