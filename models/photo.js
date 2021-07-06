const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const PhotoSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    date: {
        type: Date, default: Date.now
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

PhotoSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <div class="card border-0 mt-2" style="width: 12rem;">
        <img class="card-img-top" src="${this.images[0].url}"
        <div class="card-body">
            <br>
            <h5 class="card-title text-center">${this.title}</h5>
            <p class="card-body text-center text-truncate">${this.description}</p>
            <ul class="list-group list-group-flush">
                <li class="list-group-item text-muted text-center">${this.location}</li>
            </ul>
            <div class="card-body">
                <form action="/campgrounds/${this._id}" class="text-center">
                    <button class="btn btn-primary">View Campground</button>
                </form>
            </div>
        </div>
    </div>
    `
});

PhotoSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Photo', PhotoSchema);