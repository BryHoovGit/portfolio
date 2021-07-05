const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    phone: String,
    email: String,
    subject: String,
    message: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Contact', ContactSchema);



