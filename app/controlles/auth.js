const { httpError } = require('../helpers/handleError')
const { encrypt, compare } = require('../helpers/handleBcrypt')
const { tokenSign } = require('../helpers/generateToken')
const userModel = require('../models/users')

//TODO: Login!
const loginCtrl = async(req, res) => {
    try {

        const mockUser = {
            name: 'Leifer',
            email: 'test@test.com',
            password: '12345678',
            avatar: 'https://i.imgur.com/0mZ4PUR.png'
        }

        const { email, password } = req.body


        if (mockUser.email !== 'test@test.com') {
            res.status(404)
            res.send({ error: 'User not found' })
        }

        const checkPassword = (mockUser.password === password)
        //TODO JWT 👉
        const tokenSession = await tokenSign(mockUser) //TODO: 2d2d2d2d2d2d2
        if (checkPassword) { //TODO Contraseña es correcta!
            res.send({
                data: mockUser,
                tokenSession
            })
            return
        }
        if (!checkPassword) {
            res.status(409)
            res.send({
                error: 'Invalid password'
            })
            return
        }
    } catch (e) {
        httpError(res, e)
    }
}

const crearUsuario = async(req, res) => {
    try {
        const { email, password, name } = req.body
        const existeEmail = await userModel.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const passwordHash = await encrypt(password) //TODO: (123456)<--- Encriptando!!
        const registerUser = await userModel.create({
            email,
            name,
            password: passwordHash
        })
        // // Guardar usuario
        // await registerUser.save();
        // res.json({
        //     ok: true,
        //     registerUser
        // });

        res.send({ data: registerUser })

    } catch (e) {
        httpError(res, e)
    }
}
module.exports = { loginCtrl, crearUsuario }