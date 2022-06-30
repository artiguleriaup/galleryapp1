const mongoose = require('mongoose');
const { Schema } = mongoose;
const GallerySchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    image:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Gallery =  mongoose.model('gallery', GallerySchema);
Gallery.createIndexes();
module.exports = Gallery;