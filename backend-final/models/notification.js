const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    username: String,
    role: String,
    message: String,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema)