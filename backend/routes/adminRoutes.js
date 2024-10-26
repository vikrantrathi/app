const express = require('express');
const { approveUser, rejectUser, getUsers, getAllAppointments } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', authMiddleware, adminMiddleware, getUsers); // Get all users pending approval
router.get('/appointments', authMiddleware, adminMiddleware, getAllAppointments); // Get all appointments
router.put('/approve/:userId', authMiddleware, adminMiddleware, approveUser); // Approve a user
router.delete('/reject/:userId', authMiddleware, adminMiddleware, rejectUser); // Reject a user

module.exports = router;
