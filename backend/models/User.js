const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  rollNumber: {
    type: String,
    required: function () {
      // Only enforce rollNumber validation if the user role is 'student' and the user is being fully registered
      return this.role === 'student' && this.password;
    },
  },
  isApproved: { type: Boolean, default: false },
  otp: { type: Number }, // Store the OTP
  otpExpires: { type: Date }, // Store OTP expiration time
});
module.exports = mongoose.model('User', userSchema);