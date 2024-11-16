// /models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // OTP expires in 5 minutes
});

module.exports = mongoose.model('Otp', otpSchema);