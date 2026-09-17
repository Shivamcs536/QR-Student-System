const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  // Links a student-role account to their Student record (matches Student.group)
  studentGroup: { type: String, default: null },
});

module.exports = mongoose.model('User', userSchema);
