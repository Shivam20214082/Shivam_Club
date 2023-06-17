const mongoose = require('mongoose');

// Connect to the MongoDB database
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/forum', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
