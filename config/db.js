const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB, {
      
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
