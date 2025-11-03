"use strict";
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login, crearUsuario, googleSignIn } = require('../controlles/auth');
const { validarCampos } = require('../middleware/validar-campos');
router.post('/login', login);
router.post('/register', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);
router.post('/google', [
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    // validarCampos
], googleSignIn);
module.exports = router;
