const { httpError } = require('../helpers/handleError')
const { encrypt, compare } = require('../helpers/handleBcrypt')
const { tokenSign, generarJWT } = require('../helpers/generateToken')
const { getMenuFrontEnd} = require('../helpers/menu-frontend');
const userModel = require('../models/users')

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

const login = async( req, res = response ) => {

    const { email, password } = req.body;
    try {
        console.log(email,password);
        const usuarioDB = await userModel.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        const validPassword = compare(password,usuarioDB.password); 
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );
        res.json({
            ok: true,
            token,
            usuarioDB : usuarioDB,
            menu: getMenuFrontEnd( usuarioDB.role )
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const crearUsuario = async(req, res) => {
    try {
        const { email, password, name,age,role } = req.body
        // console.log(req);

        console.log("test1");
        const existeEmail = await userModel.findOne({ email });
        console.log("test1.2");
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        console.log("test1.3");
 
        const passwordHash = await encrypt(password) //TODO: (123456)<--- Encriptando!!
        console.log("test2");
        const registerUser = await userModel.create({
            email,
            name,
            age,
            role,
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

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;
    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await userModel.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            usuario = new userModel({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            token,
            usuarioDB : usuarioDB,
            menu: getMenuFrontEnd( usuario.role )
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }

}

module.exports = { loginCtrl, crearUsuario,googleSignIn ,login}