const mongoose = require('mongoose')

const dbConnect = () => {
    console.log("conectando a mongo")
    const DB_URI = process.env.DB_CNN
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err, res) => {
        if (!err) {
            console.log('**** CONEXION CORRECTA MONGO DB****')
        } else {
            console.log('***** ERROR DE CONEXION  BASE DE DATOS MONGOD DB****')
        }
    })
}

module.exports = { dbConnect }