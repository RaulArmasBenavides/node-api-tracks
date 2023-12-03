const jwt = require('jsonwebtoken') //TODO : 😎

const tokenSign = async (user) => { //TODO: Genera Token
    return jwt.sign(
        {
            _id: user._id, //TODO: <---
            role: user.role
        }, //TODO: Payload ! Carga útil
        process.env.JWT_SECRET, //TODO ENV 
        {
            expiresIn: "2h", //TODO tiempo de vida
        }
    );
}

const generarJWT = ( uid ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = {
            uid,
        };
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
        });
    });
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null
    }
}

const decodeSign = (token) => { //TODO: Verificar que el token sea valido y correcto
    return jwt.decode(token, null)
}



module.exports = { tokenSign, decodeSign, verifyToken,generarJWT }