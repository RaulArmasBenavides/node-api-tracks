// src/models/users.ts
import { Schema, model, Document } from "mongoose";

/**
 * Interface TypeScript para tipar el documento de usuario
 */
export interface IUser extends Document {
  name: string;
  age?: number;
  email: string;
  password: string;
  role: string;
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
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Exporta el modelo de usuario
 */
export const UserModel = model<IUser>("users", UserSchema);

export default UserModel;
