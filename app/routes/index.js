const express = require('express');
const router = express.Router();

// monta rutas explícitas
router.use('/auth', require('./auth'));     // -> /api/.../auth/*
router.use('/tracks', require('./tracks')); // -> /api/.../tracks/*

// 404 para cualquier otra ruta de este router
router.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = router;