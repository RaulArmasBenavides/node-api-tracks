const mongoose = require('mongoose')

const TrackSchema  = Schema({
    // _id: {
    //      type: Number
    // },
    name: {
        type: String
    },
    album: {
        type: String
    },
    cover: {
        type: String
    },
    artist: {
        name: {
            type: String
        },
        nickname:{
            type:String
        },
        nationality:{
            type:String
        }
      },
      duration: {
        start: {
            type: Number
        },
        end:{
            type:Number
        }
      },
      url: {
        type: String
    },
    });


   TrackSchema.method('toJSON', function() {
     const { __v, _id, password, ...object } = this.toObject();
     object.uid = _id;
     return object;
   })
module.exports = mongoose.model('tracks', TrackSchema);