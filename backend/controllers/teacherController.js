// backend/controllers/teacherController.js
const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }, 'name email');
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available slots for a specific teacher
exports.getAvailableSlots = async (req, res) => {
  const { teacherId } = req.params;
  const { date } = req.query;

  try {
    const availability = await Availability.findOne({
      teacherId,
      date: new Date(date)
    });

    if (!availability) {
      return res.status(404).json({ message: 'No available slots for the selected date.' });
    }

    // Get booked appointments for the teacher on this date
    const bookedAppointments = await Appointment.find({
      teacherId,
      date: new Date(date),
      status: { $in: ['pending', 'approved', 'rescheduled'] },
    });

    const bookedTimeSlots = bookedAppointments.map((appointment) => appointment.timeSlot);

    const availableSlots = availability.timeSlots.filter(
      (slot) => !bookedTimeSlots.includes(`${slot.startTime} - ${slot.endTime}`)
    );

    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching available slots:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments for the authenticated teacher
exports.getTeacherAppointments = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const appointments = await Appointment.find({ teacherId })
      .populate('studentId', 'name email')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching teacher appointments:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
