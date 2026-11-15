// src/presentation/routes/library.ts
// Montado en /api/v1/me — todas las rutas requieren JWT.
import { Router } from 'express';
import { requireUser } from '../middleware/requireUser';
import {
  getProfile,
  listPlaylists, createPlaylist, updatePlaylist, deletePlaylist, resetPlaylists,
  addTrackToPlaylist, removeTrackFromPlaylist,
  listLikes, addLike, removeLike
} from '../controllers/library';

const router = Router();

router.use(requireUser);

router.get('/profile', getProfile);

router.get('/playlists', listPlaylists);
router.post('/playlists', createPlaylist);
router.post('/playlists/reset', resetPlaylists);
router.patch('/playlists/:id', updatePlaylist);
router.delete('/playlists/:id', deletePlaylist);
router.post('/playlists/:id/tracks', addTrackToPlaylist);
router.delete('/playlists/:id/tracks/:trackKey', removeTrackFromPlaylist);

router.get('/likes', listLikes);
router.put('/likes/:trackKey', addLike);
router.delete('/likes/:trackKey', removeLike);

export default router;
