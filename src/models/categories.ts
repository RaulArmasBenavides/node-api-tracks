// src/models/categories.ts
import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Equivalente a method('toJSON') de tu JS, quitando __v.
CategorySchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: any) => {
    // en tu código original sólo removías __v (ya está deshabilitado arriba),
    // si quisieras también podrías convertir _id -> id:
    // ret.id = ret._id;
    // delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CategoryModel = model<ICategory>("categories", CategorySchema);
export default CategoryModel;
