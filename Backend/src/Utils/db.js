const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, );
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection failed:', error);
    }
}

module.exports = connectDB;