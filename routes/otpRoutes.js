
const express = require('express');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const Otp = require('../models/Otp');  
const User = require('../models/User');  
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key'; 


router.post('/generate-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    
    try {
        
        const existingOtp = await Otp.findOne({ phoneNumber });
        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        } else {
            const newOtp = new Otp({ phoneNumber, otp });
            await newOtp.save();
        }

       
        console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

        return res.status(200).json({ message: 'OTP generated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error generating OTP', error: err.message });
    }
});


router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    try {
        
        const storedOtp = await Otp.findOne({ phoneNumber });

        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP or phone number' });
        }

        
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = new User({ phoneNumber });
            await user.save();
        }

        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);  

        
        await Otp.deleteOne({ phoneNumber });

        return res.status(200).json({ message: 'OTP verified successfully', token });
    } catch (err) {
        return res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
});

module.exports = router;
