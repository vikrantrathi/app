// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String, // Ensure this is a readable string
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'rescheduled', 'cancelled'],
    default: 'pending',
  },
  cancellationReason: {
    type: String,
    required: function () {
      return this.status === 'cancelled';
    },
  },
  rejectionReason: {
    type: String,
    required: function () {
      return this.status === 'rejected';
    },
  },
  rescheduleReason: {
    type: String,
    required: function () {
      return this.status === 'rescheduled';
    },
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
