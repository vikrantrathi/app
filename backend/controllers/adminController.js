const User = require('../models/User');

// Approve a user (set isApproved to true and isRejected to false)
exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark the user as approved and not rejected
    user.isApproved = true;
    user.isRejected = false;
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

// Reject a user (set isRejected to true and isApproved to false)
exports.rejectUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark the user as rejected and not approved
    user.isRejected = true;
    user.isApproved = false;
    await user.save();

    res.json({ message: 'User rejected successfully', user });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Error rejecting user', error: error.message });
  }
};

// Get all users (both approved and rejected)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const Appointment = require('../models/Appointment'); // Ensure this is correctly imported

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Adjust this if you need to filter or sort the appointments
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};
