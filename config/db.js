const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config(); 

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://<taskmasteradmin>:<jomasesu>@Taskmaster0.mongodb.net/<dbname>?retryWrites=true&w=majority";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
