 const { Schema, model } = require('mongoose');
const UserScheme = Schema({
        name: {
            type: String
        },
        age: {
            type: Number
        },
        email: {
            type: String
        },

        password: {
            type: String
        },
        role: {
            type: String,
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    })

module.exports = model('users', UserScheme)