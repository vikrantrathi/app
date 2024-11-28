const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP function
exports.sendOtp = async (req, res) => {
  const { name, email } = req.body;
  const domain = '@bitmesra.ac.in';

  try {
    if (!email.endsWith(domain)) {
      email = email + domain;
    }

    const otp = generateOTP();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
        role: 'student', // Default role until specified
      });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
    }

    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for Email Verification',
      text: `Hello ${name},\n\nYour OTP is ${otp}. It is valid for 10 minutes.\n\nThank you!`,
    });

    res.status(200).json({
      message: 'OTP sent successfully. Please verify your email.',
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.', error: error.message });
  }
};

// Verify OTP function
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== Number(otp) || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'OTP verified successfully!',
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register user function
exports.register = async (req, res) => {
  const { name, email, password, role, rollNumber } = req.body;
  const domain = '@bitmesra.ac.in';

  try {
    if (!email.endsWith(domain)) {
      email = email + domain;
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.isApproved) {
      return res.status(400).json({
        message: 'Email verification required. Please verify OTP before registering.',
      });
    }

    if (role === 'student' && !rollNumber) {
      return res.status(400).json({ message: 'Roll number is required for students.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.role = role;
    existingUser.rollNumber = role === 'student' ? rollNumber : undefined;
    existingUser.isApproved = false; // Mark as not approved

    await existingUser.save();

    // Send notification email to user about pending approval
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Registration Pending Approval',
      text: `Hello ${name},\n\nYour registration is complete and is now pending admin approval. You will be notified once your profile is approved. This process may take 24-48 hours.\n\nThank you!`,
    });

    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval.',
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login Request Received:', { email, password }); // Log the incoming payload

    if (!email || !password) {
      console.log('Missing email or password'); // Log missing fields
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }); // Ensure case-insensitive email
    console.log('User Found:', user); // Log the user object

    if (!user) {
      console.log('User not found'); // Log if no user is found
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch); // Log if the password matches

    if (!isMatch) {
      console.log('Invalid password'); // Log invalid password
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(400).json({ message: 'Your account is awaiting approval or email verification.' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('Login Successful'); // Log successful login
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    console.error('Error in login:', error); // Log unexpected errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get the currently logged-in user (GET /me)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
