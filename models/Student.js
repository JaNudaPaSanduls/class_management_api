const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
    profilePic: {
        type: String,
        default: "https://www.google.com"
    },
    tel_number: {
        type: Number,
        required: true
    },
    nic: {
        type: Number,
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
        default: 'ABSENT'
    },
    absent_count: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Active'
    }
});

const Student = mongoose.model('students', StudentSchema);
module.exports = Student;