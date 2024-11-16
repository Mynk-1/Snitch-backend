// routes/paymentRoutes.js
const express = require('express');
const { createOrder, verifyPayment } = require('../Controllers/paymentController.js');

const router = express.Router();

// Route to create a new Razorpay order
router.post('/create-order', createOrder);

// Route to verify the Razorpay payment
router.post('/verify-payment', verifyPayment);

module.exports = router;
