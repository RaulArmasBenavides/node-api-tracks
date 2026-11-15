// src/presentation/controllers/library.ts
// Playlists, canciones de playlists y "me gusta" por usuario (MongoDB).
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import PlaylistModel, { IPlaylist } from '../../models/playlist.model';
import LikeModel from '../../models/like.model';
import UserModel from '../../models/users.model';

const MAX_NAME = 60;
const MAX_COVER_CHARS = 500_000; // ~375 KB de imagen en base64
const DEFAULT_PLAYLIST_NAMES = ['Mi lista º1', 'Mi lista º2', 'Mi lista º3', 'Mi lista º4'];

type TrackInput = { _id: string | number; name: string } & Record<string, unknown>;

function userIdOf(res: Response): string {
  return res.locals.userId as string;
}

function fail(res: Response, status: number, msg: string): void {
  res.status(status).json({ error: msg });
}

function handleDbError(res: Response, err: unknown): void {
  console.error('[library]', err);
  res.status(503).json({ error: 'Base de datos de biblioteca no disponible' });
}

function parseTrack(body: unknown): TrackInput | null {
  const track = (body as { track?: unknown } | undefined)?.track as TrackInput | undefined;
  if (!track || typeof track !== 'object') return null;
  if (track._id === undefined || track._id === null) return null;
  if (typeof track.name !== 'string') return null;
  return track;
}

function parseName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  if (!clean) return null;
  return clean.slice(0, MAX_NAME);
}

/** Id válido de Mongo o null (evita CastError en las rutas). */
function objectIdOrNull(value: unknown): string | null {
  const id = String(value ?? '');
  return Types.ObjectId.isValid(id) ? id : null;
}

/** Forma que consume el frontend: { id, name, cover, tracks: [track, ...] } */
function toPlaylistJson(p: IPlaylist) {
  return {
    id: String(p._id),
    name: p.name,
    cover: p.cover ?? undefined,
    tracks: p.tracks.map(t => t.track)
  };
}

async function createDefaults(userId: string): Promise<void> {
  await PlaylistModel.insertMany(
    DEFAULT_PLAYLIST_NAMES.map((name, i) => ({ userId, name, position: i + 1, tracks: [] }))
  );
}

async function findOwned(userId: string, playlistId: string): Promise<IPlaylist | null> {
  return PlaylistModel.findOne({ _id: playlistId, userId });
}

// ===== Perfil =====

export const getProfile = async (_req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ id: userIdOf(res) }).select('id name').lean();
    if (!user) return fail(res, 404, 'Usuario no encontrado');
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    handleDbError(res, err);
  }
};

// ===== Playlists =====

export const listPlaylists = async (_req: Request, res: Response) => {
  const userId = userIdOf(res);
  try {
    let lists = await PlaylistModel.find({ userId }).sort({ position: 1, createdAt: 1 });
    if (lists.length === 0) {
      // Primera vez: creamos las 4 listas por defecto
      await createDefaults(userId);
      lists = await PlaylistModel.find({ userId }).sort({ position: 1, createdAt: 1 });
    }
    res.json({ data: lists.map(toPlaylistJson) });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  const userId = userIdOf(res);
  try {
    const count = await PlaylistModel.countDocuments({ userId });
    const name = parseName(req.body?.name) ?? `Mi lista nº${count + 1}`;
    const playlist = await PlaylistModel.create({ userId, name, position: count + 1, tracks: [] });
    res.status(201).json({ data: toPlaylistJson(playlist) });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const userId = userIdOf(res);
  const id = objectIdOrNull(req.params.id);
  if (!id) return fail(res, 404, 'Lista no encontrada');
  try {
    const playlist = await findOwned(userId, id);
    if (!playlist) return fail(res, 404, 'Lista no encontrada');

    if (req.body?.name !== undefined) {
      const name = parseName(req.body.name);
      if (!name) return fail(res, 400, 'Nombre no válido');
      playlist.name = name;
    }
    if (req.body?.cover !== undefined) {
      const cover = req.body.cover;
      const valid = cover === null
        || (typeof cover === 'string' && cover.startsWith('data:image/') && cover.length <= MAX_COVER_CHARS);
      if (!valid) return fail(res, 400, 'Imagen no válida o demasiado grande');
      playlist.cover = cover ?? undefined;
    }
    await playlist.save();
    res.json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  const userId = userIdOf(res);
  const id = objectIdOrNull(req.params.id);
  if (!id) return fail(res, 404, 'Lista no encontrada');
  try {
    const { deletedCount } = await PlaylistModel.deleteOne({ _id: id, userId });
    if (!deletedCount) return fail(res, 404, 'Lista no encontrada');
    res.json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};

/** Borra todas las listas del usuario y crea las 4 por defecto. */
export const resetPlaylists = async (_req: Request, res: Response) => {
  const userId = userIdOf(res);
  try {
    await PlaylistModel.deleteMany({ userId });
    await createDefaults(userId);
    const lists = await PlaylistModel.find({ userId }).sort({ position: 1, createdAt: 1 });
    res.json({ data: lists.map(toPlaylistJson) });
  } catch (err) {
    handleDbError(res, err);
  }
};

// ===== Canciones de una playlist =====

export const addTrackToPlaylist = async (req: Request, res: Response) => {
  const userId = userIdOf(res);
  const id = objectIdOrNull(req.params.id);
  if (!id) return fail(res, 404, 'Lista no encontrada');
  const track = parseTrack(req.body);
  if (!track) return fail(res, 400, 'Canción no válida');
  const key = String(track._id);
  try {
    // Solo añade si la lista es del usuario y la canción no está ya (atómico)
    const result = await PlaylistModel.updateOne(
      { _id: id, userId, 'tracks.key': { $ne: key } },
      { $push: { tracks: { key, track } } }
    );
    if (result.matchedCount === 0) {
      const exists = await findOwned(userId, id);
      if (!exists) return fail(res, 404, 'Lista no encontrada');
    }
    res.status(201).json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const removeTrackFromPlaylist = async (req: Request, res: Response) => {
  const userId = userIdOf(res);
  const id = objectIdOrNull(req.params.id);
  if (!id) return fail(res, 404, 'Lista no encontrada');
  try {
    const { matchedCount } = await PlaylistModel.updateOne(
      { _id: id, userId },
      { $pull: { tracks: { key: String(req.params.trackKey) } } }
    );
    if (!matchedCount) return fail(res, 404, 'Lista no encontrada');
    res.json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};

// ===== Me gusta =====

export const listLikes = async (_req: Request, res: Response) => {
  try {
    const likes = await LikeModel.find({ userId: userIdOf(res) }).sort({ createdAt: 1 }).lean();
    res.json({ data: likes.map(l => l.track) });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const addLike = async (req: Request, res: Response) => {
  const track = parseTrack(req.body);
  if (!track) return fail(res, 400, 'Canción no válida');
  const key = String(track._id);
  if (key !== String(req.params.trackKey)) {
    return fail(res, 400, 'La clave no coincide con la canción');
  }
  try {
    await LikeModel.updateOne(
      { userId: userIdOf(res), trackKey: key },
      { $setOnInsert: { track } },
      { upsert: true }
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};

export const removeLike = async (req: Request, res: Response) => {
  try {
    await LikeModel.deleteOne({ userId: userIdOf(res), trackKey: String(req.params.trackKey) });
    res.json({ ok: true });
  } catch (err) {
    handleDbError(res, err);
  }
};
