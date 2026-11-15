// src/models/playlist.model.ts
// Playlists del usuario. Cada canción embebida guarda una clave (key) y una copia del track.
import { Schema, model, Document } from 'mongoose';

export interface IPlaylistTrack {
  key: string;
  track: Record<string, unknown>;
}

export interface IPlaylist extends Document {
  userId: string;
  name: string;
  cover?: string;
  position: number;
  tracks: IPlaylistTrack[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistTrackSchema = new Schema<IPlaylistTrack>(
  {
    key: { type: String, required: true },
    track: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const PlaylistSchema = new Schema<IPlaylist>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    cover: { type: String },
    position: { type: Number, default: 0 },
    tracks: { type: [PlaylistTrackSchema], default: [] }
  },
  { timestamps: true }
);

const PlaylistModel = model<IPlaylist>('Playlist', PlaylistSchema);
export default PlaylistModel;
