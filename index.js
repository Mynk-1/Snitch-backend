// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const paymentRoutes = require('./routes/paymentRoutes.js'); // Correct path to payment routes
const otpRoutes = require('./routes/otpRoutes'); // Correct path to OTP routes

require('dotenv').config(); // Load environment variables from .env in the root directory

const app = express();

// Enable CORS for requests from React frontend
app.use(cors({
    origin: 'https://snitch-clone-beta.vercel.app/'
}));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name', { // Replace 'your_database_name' with your actual database name
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Use routes
app.use('/api/otp', otpRoutes);          // Route for OTP functionality
app.use('/api/payment', paymentRoutes);   // Route for payment functionality

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
