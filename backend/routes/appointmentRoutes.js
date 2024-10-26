const express = require('express');
const {
  createAppointment,
  getAppointments,
  getStudentAppointments,
  getTodayAppointments,
  getStudentAppointmentStats,
  getAllAppointments,
  getTeacherAppointments,
  approveAppointment,
  rejectAppointment,
  rescheduleAppointment,
  deleteAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new appointment (Student books an appointment with a Teacher)
router.post('/', authMiddleware, createAppointment);

// Route to get all appointments for a student or teacher
router.get('/', authMiddleware, getAppointments);

// Route to get all appointments for a specific student
router.get('/student', authMiddleware, getStudentAppointments);

// Route to get today's appointments for a student
router.get('/student/today', authMiddleware, getTodayAppointments);

// Route to get appointment statistics for a student
router.get('/student/stats', authMiddleware, getStudentAppointmentStats);

// Route to get today's appointments for a teacher
router.get('/teacher', authMiddleware, getTeacherAppointments); // Ensure this function is defined

// Route to get all appointments (admin access)
router.get('/all', authMiddleware, getAllAppointments);

// Route to approve an appointment (Teacher)
router.post('/:appointmentId/approve', authMiddleware, approveAppointment);

// Route to reject an appointment with a reason (Teacher)
router.post('/:appointmentId/reject', authMiddleware, rejectAppointment);

// Route to reschedule an appointment (Teacher)
router.post('/:appointmentId/reschedule', authMiddleware, rescheduleAppointment);

// Route to cancel an appointment (Student)
router.post('/:appointmentId/cancel', authMiddleware, cancelAppointment);

// Route to delete an appointment (Admin or Student)
router.delete('/:appointmentId', authMiddleware, deleteAppointment);

module.exports = router;
