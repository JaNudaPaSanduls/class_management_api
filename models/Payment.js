const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
    date: {
        type: String,
        required: true
    }
});

const Payment = mongoose.model('payments', PaymentSchema);
module.exports = Payment;