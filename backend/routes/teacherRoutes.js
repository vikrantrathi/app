// backend/routes/teacherRoutes.js
const express = require('express');
const {
  getAllTeachers,
  getAvailableSlots,
  getTeacherAppointments,
} = require('../controllers/teacherController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all teachers
router.get('/teachers', authMiddleware, getAllTeachers);

// Route to get available slots for a specific teacher
router.get('/teachers/:teacherId/slots', authMiddleware, getAvailableSlots);

// Route to get appointments for the authenticated teacher
router.get('/appointments', authMiddleware, getTeacherAppointments);

module.exports = router;
