// src/controllers/tracks.ts
import { Request, Response } from "express";
import { httpError } from "../helpers/handleError";
import TrackModel, { type ITrack } from "../models/track";

// Si ya tienes una augmentación global para Request, elimina esto:
declare module "express-serve-static-core" {
  interface Request {
    uid?: string; // si tu auth middleware setea req.uid
  }
}

const URL_PUBLIC = process.env.URL_PUBLIC ?? "/";

/**
 * Devuelve una lista mock (hardcode) de tracks
 */
export const getItems = async (_req: Request, res: Response) => {
  try {
    const listAll = [
      {
        _id: 1,
        name: "Getting Over",
        album: "One Love",
        cover: "https://jenesaispop.com/wp-content/uploads/2009/09/guetta_onelove.jpg",
        artist: { name: "David Guetta", nickname: "David Guetta", nationality: "FR" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track.mp3`,
      },
      {
        _id: 2,
        name: "Snow Tha Product || BZRP Music Sessions #39",
        album: "BZRP Music Sessions",
        cover:
          "https://is5-ssl.mzstatic.com/image/thumb/Features125/v4/9c/b9/d0/9cb9d017-fcf6-28c6-81d0-e9ac5b0f359e/pr_source.png/800x800cc.jpg",
        artist: { name: "Snow", nickname: "Snow", nationality: "US" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-1.mp3`,
      },
      {
        _id: 3,
        name: "Calypso (Original Mix)",
        album: "Round Table Knights",
        cover: "https://cdns-images.dzcdn.net/images/cover/1db3f8f185e68f26feaf0b9d72ff1645/350x350.jpg",
        artist: { name: "Round Table Knights", nickname: "Round Table Knights", nationality: "US" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-2.mp3`,
      },
      {
        _id: 4,
        name: "Bad Habits",
        album: "Ed Sheeran",
        cover:
          "https://www.lahiguera.net/musicalia/artistas/ed_sheeran/disco/11372/tema/25301/ed_sheeran_bad_habits-portada.jpg",
        artist: { name: "Ed Sheeran", nickname: "Ed Sheeran", nationality: "UK" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-4.mp3`,
      },
      {
        _id: 5,
        name: "BEBE (Official Video)",
        album: "Giolì & Assia",
        cover: "https://i.scdn.co/image/ab67616d0000b27345ca41b0d2352242c7c9d4bc",
        artist: { name: "Giolì & Assia", nickname: "Giolì & Assia", nationality: "IT" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-3.mp3`,
      },
      {
        _id: 6,
        name: "T.N.T. (Live At River Plate, December 2009)",
        album: "AC/DC",
        cover: "https://cdns-images.dzcdn.net/images/cover/ba5eaf2f3a49768164d0728b7ba64372/500x500.jpg",
        artist: { name: "AC/DC", nickname: "AC/DC", nationality: "US" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-5.mp3`,
      },
      {
        _id: 7,
        name: "50 Cent - Candy Shop (feat. Olivia)",
        album: "50 Cent",
        cover: "https://i.scdn.co/image/ab67616d0000b27391f7222996c531b981e7bb3d",
        artist: { name: "50 Cent", nickname: "50 Cent", nationality: "US" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-6.mp3`,
      },
      {
        _id: 8,
        name: "Bésame💋",
        album: "Valentino Ft MTZ Manuel Turizo (Video Oficial)",
        cover: "https://i1.sndcdn.com/artworks-000247627460-1hqnjr-t500x500.jpg",
        artist: { name: "Valentino", nickname: "Valentino", nationality: "CO" },
        duration: { start: 0, end: 333 },
        url: `${URL_PUBLIC}/track-7.mp3`,
      },
    ];

    res.send({ data: listAll });
  } catch (e) {
    httpError(res, e);
  }
};

/**
 * Devuelve tracks desde la DB
 */
export const getItemsFromDB = async (_req: Request, res: Response) => {
  const tracks = await TrackModel.find();
  res.json({ ok: true, data: tracks });
};

/**
 * Devuelve un track por id
 */
export const getItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const track = await TrackModel.findById(id);

    if (!track) {
      return res.status(404).json({ ok: false, msg: "Canción no encontrada por id" });
    }
    return res.json({ ok: true, data: track });
  } catch (e) {
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

/**
 * Crea un track
 */
export const createItem = async (req: Request<{}, {}, Partial<ITrack>>, res: Response) => {
  try {
    const trackData = req.body;
    // si tu middleware de auth setea req.uid, podrías guardarlo aquí
    // const uid = req.uid;

    const newTrack = new TrackModel(trackData);
    const savedTrack = await newTrack.save();

    return res.status(201).json({
      ok: true,
      message: "Track creado exitosamente",
      track: savedTrack,
    });
  } catch (e) {
    httpError(res, e);
  }
};

/**
 * Actualiza un track por id
 */
export const updateItem = async (
  req: Request<{ id: string }, {}, Partial<ITrack>>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const exists = await TrackModel.findById(id);
    if (!exists) {
      return res.status(404).json({ ok: false, msg: "Canción no encontrada por id" });
    }

    // Si quieres registrar el usuario que actualiza:
    // const uid = req.uid;
    // const cambios = { ...req.body, usuario: uid };

    const trackUpdated = await TrackModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ ok: true, track: trackUpdated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

/**
 * Elimina un track por id
 */
export const deleteItem = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const track = await TrackModel.findById(id);
    if (!track) {
      return res.status(404).json({ ok: false, msg: "Track no encontrado por id" });
    }

    await TrackModel.findByIdAndDelete(id);
    return res.json({ ok: true, msg: "Track eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: "Hable con el administrador" });
  }
};

export default { getItem, getItems, getItemsFromDB, deleteItem, createItem, updateItem };
