const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  group: { type: String, required: true, unique: true },
  qrCode: { type: String, unique: true }, // Added unique constraint
  photo: { type: String, default: 'https://via.placeholder.com/100' },
  email: { type: String },
  attendance: { type: Number, default: 0 },
  totalClasses: { type: Number, default: 100 },
  courses: [{ 
    name: String, 
    status: { type: String, enum: ['Active', 'Completed', 'Dropped'], default: 'Active' } 
  }],
  grades: [{ course: String, grade: Number }],
  assignments: [{
    title: String,
    status: { type: String, enum: ['Due', 'Submitted', 'Pending'], default: 'Due' },
    dueDate: Date,
    grade: { type: Number, default: null },
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null }
  }]
});

studentSchema.index({ group: 1 }, { unique: true });
studentSchema.index({ qrCode: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);