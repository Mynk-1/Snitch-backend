// /routes/otpRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const Otp = require('../models/Otp');  // Otp model for OTP storage
const User = require('../models/User');  // User model for User storage
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';  // Secret key for JWT token

// Generate OTP
router.post('/generate-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Save OTP to the database
    try {
        // Check if the phone number already has an OTP, if so, update it
        const existingOtp = await Otp.findOne({ phoneNumber });
        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        } else {
            const newOtp = new Otp({ phoneNumber, otp });
            await newOtp.save();
        }

        // For demonstration, logging OTP, in production you would send via SMS
        console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

        return res.status(200).json({ message: 'OTP generated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error generating OTP', error: err.message });
    }
});

// Verify OTP and create User with JWT
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    try {
        // Find the OTP for the given phone number
        const storedOtp = await Otp.findOne({ phoneNumber });

        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP or phone number' });
        }

        // OTP verified, check if user exists, if not create a new user
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = new User({ phoneNumber });
            await user.save();
        }

        // Generate a JWT token with the user's _id
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);  // No expiration and no phone number in JWT

        // Remove OTP after verification
        await Otp.deleteOne({ phoneNumber });

        return res.status(200).json({ message: 'OTP verified successfully', token });
    } catch (err) {
        return res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
});

module.exports = router;
