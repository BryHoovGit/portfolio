const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    name: String,
    phoneNumber: Number,
    email: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subject: String,
    message: String,
});

module.exports = mongoose.model('Contact', ContactSchema);