const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    classId: {
        type: Number,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    attendance: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Attendance = mongoose.model('attendances', AttendanceSchema);
module.exports = Attendance;