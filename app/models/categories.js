const { Schema, model } = require('mongoose');
const CategoryScheme = Schema({
    name: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true,
        versionKey: false
    });


    CategoryScheme.method('toJSON', function() {
        const { __v, ...object } = this.toObject();
        return object;
    })
    

module.exports = model('categories', CategoryScheme)