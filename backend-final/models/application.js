const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const applicationSchema = new Schema({
    username: String,
    znumber: String,
    name: String,
    email: String,
    phoneNumber: String,
    joiningDate: Date,
    previousTACourses: [String],
    eligibleCourses: [String],
    DSCourses: [String],
    resume: String,
    status: [String],
    review: String
});
module.exports = mongoose.model('Application', applicationSchema);