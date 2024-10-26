const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      startTime: { type: String, required: true }, // Format: "10:00 AM"
      endTime: { type: String, required: true },   // Format: "11:00 AM"
    },
  ],
});

module.exports = mongoose.model('Availability', availabilitySchema);
