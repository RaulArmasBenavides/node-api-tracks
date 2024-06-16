const mongoose = require('mongoose')

const dbConnect = async() => {
    console.log("conectando a mongo")
    const DB_URI = process.env.DB_CNN
    await mongoose.connect( process.env.DB_CNN2 , {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        // useCreateIndex: true
    });
}

module.exports = { dbConnect }