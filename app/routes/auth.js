const express = require('express')
const router = express.Router()

const { loginCtrl, crearUsuario } = require('../controlles/auth')

router.post('/login', loginCtrl)
router.post('/register', crearUsuario)


module.exports = router