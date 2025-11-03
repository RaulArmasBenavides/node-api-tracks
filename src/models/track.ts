// src/models/tracks.ts
import { Schema, model, Document } from "mongoose";

export interface IArtist {
  name?: string;
  nickname?: string;
  nationality?: string;
}

export interface IDuration {
  start?: number;
  end?: number;
}

export interface ITrack extends Document {
  name?: string;
  album?: string;
  cover?: string;
  artist?: IArtist;
  duration?: IDuration;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // for the toJSON transform
  uid?: string;
}

const TrackSchema = new Schema<ITrack>(
  {
    name: { type: String },
    album: { type: String },
    cover: { type: String },
    artist: {
      name: { type: String },
      nickname: { type: String },
      nationality: { type: String },
    },
    duration: {
      start: { type: Number },
      end: { type: Number },
    },
    url: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// toJSON: remueve __v/_id y expone uid (opcionalmente quita password si existiera)
TrackSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret: any) => {
    const { __v, _id, password, ...rest } = ret;
    return { ...rest, uid: _id };
  },
});

export const TrackModel = model<ITrack>("tracks", TrackSchema);
export default TrackModel;
