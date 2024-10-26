const Appointment = require('../models/Appointment');
const User = require('../models/User');
const moment = require('moment');

// Create a new appointment (Student books an appointment with a Teacher)
exports.createAppointment = async (req, res) => {
  const { teacherId, date, timeSlot } = req.body;
  const studentId = req.user.id;

  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    // Check if the selected time slot is already booked
    const existingAppointment = await Appointment.findOne({
      teacherId,
      date,
      timeSlot,
      status: { $in: ['pending', 'approved', 'rescheduled'] },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked. Please select another slot.' });
    }

    const newAppointment = new Appointment({
      studentId,
      teacherId,
      date,
      timeSlot,
      status: 'pending',
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments for a specific teacher
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

// Get all appointments for a student or teacher
exports.getAppointments = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let appointments;

    if (userRole === 'student') {
      appointments = await Appointment.find({ studentId: userId })
        .populate('teacherId', 'name email')
        .select('date timeSlot status rejectionReason cancellationReason');
    } else if (userRole === 'teacher') {
      appointments = await Appointment.find({ teacherId: userId })
        .populate('studentId', 'name email')
        .select('date timeSlot status rejectionReason cancellationReason');
    } else if (userRole === 'admin') {
      appointments = await Appointment.find()
        .populate('studentId', 'name email')
        .populate('teacherId', 'name email')
        .select('date timeSlot status rejectionReason cancellationReason');
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve an appointment
exports.approveAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const teacherId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    appointment.status = 'approved';
    await appointment.save();

    res.json({ message: 'Appointment approved successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject an appointment with a reason
exports.rejectAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { reason } = req.body;
  const teacherId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    appointment.status = 'rejected';
    appointment.rejectionReason = reason;
    await appointment.save();

    res.json({ message: 'Appointment rejected with reason', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reschedule an appointment
// In appointmentController.js
exports.rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { newDate, newTimeSlot, rescheduleReason } = req.body;
  const teacherId = req.user.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    if (!rescheduleReason) {
      return res.status(400).json({ message: 'Reschedule reason is required' });
    }

    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.rescheduleReason = rescheduleReason;
    appointment.status = 'rescheduled';
    await appointment.save();

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Delete an appointment (Admin or the student can cancel)
exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments with student and teacher details populated
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('studentId', 'name email')
      .populate('teacherId', 'name email');
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get appointment stats for a student
exports.getStudentAppointmentStats = async (req, res) => {
  const studentId = req.user.id;

  try {
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);
    const next7Days = new Date(now);
    next7Days.setDate(now.getDate() + 7);

    const totalAppointments = await Appointment.countDocuments({ studentId });
    const totalCancelled = await Appointment.countDocuments({ studentId, status: 'cancelled' });
    const totalRescheduled = await Appointment.countDocuments({ studentId, status: 'rescheduled' });
    const last30DaysAppointments = await Appointment.countDocuments({
      studentId,
      date: { $gte: last30Days, $lte: now },
    });
    const next7DaysAppointments = await Appointment.countDocuments({
      studentId,
      date: { $gte: now, $lte: next7Days },
    });

    res.json({
      totalAppointments,
      totalCancelled,
      totalRescheduled,
      last30DaysAppointments,
      next7DaysAppointments,
    });
  } catch (error) {
    console.error('Error fetching student appointment stats:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's appointments for a student
exports.getTodayAppointments = async (req, res) => {
  const studentId = req.user.id;
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().endOf('day').toDate();

  try {
    const appointments = await Appointment.find({
      studentId,
      date: { $gte: today, $lte: tomorrow },
    }).populate('teacherId', 'name email');

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments for a student
exports.getStudentAppointments = async (req, res) => {
  const studentId = req.user.id;

  try {
    const appointments = await Appointment.find({ studentId })
      .populate('teacherId', 'name email')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { cancellationReason } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
