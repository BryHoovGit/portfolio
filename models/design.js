const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const designSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    date: {
        type: Date, default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: String,
});

module.exports = mongoose.model('Design', designSchema);