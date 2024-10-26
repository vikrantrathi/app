const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false }, // New field for rejected status
});

module.exports = mongoose.model('User', userSchema);
