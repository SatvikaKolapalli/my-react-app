const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

require('dotenv').config()

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(cors('*'));
app.use(express.json());

// Middlewares for APIs
app.use('/inventory', require('./routes/inventory'));
app.use('/user', require('./routes/user'));

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connection established successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Route to handle addition operation
app.post('/api/addition', (req, res) => {
    const { num1, num2 } = req.body;
    const sum = num1 + num2;
    res.json({ result: sum });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
