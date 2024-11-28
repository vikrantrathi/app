const express = require('express');
const {
  register,
  login,
  getMe,
  verifyOtp,
  sendOtp,
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/login', login);

// Protected Route
router.get('/me', authMiddleware, getMe);

module.exports = router;
