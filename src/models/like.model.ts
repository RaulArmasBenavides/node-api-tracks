// src/models/like.model.ts
// "Me gusta" de cada usuario: una fila por (usuario, canción).
import { Schema, model, Document } from 'mongoose';

export interface ILike extends Document {
  userId: string;
  trackKey: string;
  track: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: String, required: true },
    trackKey: { type: String, required: true },
    track: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, trackKey: 1 }, { unique: true });

const LikeModel = model<ILike>('Like', LikeSchema);
export default LikeModel;
