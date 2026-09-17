const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-student-progress';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");

    // Safeguard: Drop registerNumber_1 index if it exists
    try {
      await mongoose.connection.db.collection('students').dropIndex('registerNumber_1');
      console.log('Dropped registerNumber_1 index if it existed');
    } catch (err) {
      if (err.codeName !== 'IndexNotFound') {
        console.error('Error dropping registerNumber_1 index:', err);
      }
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from MongoDB'));

module.exports = connectDB;