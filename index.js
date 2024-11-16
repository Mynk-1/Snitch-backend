
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const paymentRoutes = require('./routes/paymentRoutes.js'); 
const otpRoutes = require('./routes/otpRoutes'); 

require('dotenv').config(); 
const app = express();


app.use(cors({
    origin: 'https://snitch-clone-beta.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',    
    
    credentials: true,                            
    
}));


app.use(bodyParser.json());


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


app.use('/api/otp', otpRoutes);         
app.use('/api/payment', paymentRoutes); 

app.get("/",(req,res)=>{
    res.json({success:"server running successfully"})
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
