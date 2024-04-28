const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
    username: String,
    name: String,
    email: String,
    course: String,
    feedback: String,
    rating: Number,
}, { timestamps: true });



module.exports = mongoose.model('Feedback', feedbackSchema);