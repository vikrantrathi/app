const Availability = require('../models/Availability');

// Get availability for a teacher
exports.getAvailability = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const availability = await Availability.find({ teacherId }).sort({ date: 1 });
    res.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//delete slot
// availabilityController.js
exports.deleteSlot = async (req, res) => {
  const { availabilityId } = req.params;
  const { slot } = req.body; // This will contain `startTime` and `endTime` if a specific slot is to be deleted

  try {
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    // If a specific slot is provided, delete only that slot
    if (slot && slot.startTime && slot.endTime) {
      availability.timeSlots = availability.timeSlots.filter(
        (s) => !(s.startTime === slot.startTime && s.endTime === slot.endTime)
      );
    } else {
      // If no specific slot is provided, delete all slots for the day
      availability.timeSlots = [];
    }

    // Save the updated availability
    await availability.save();
    res.json({ message: 'Slot(s) deleted successfully', availability });
  } catch (error) {
    console.error('Error deleting slot(s):', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add or update availability for a specific date with non-overlapping time slots
exports.addAvailability = async (req, res) => {
  const { date, timeSlots } = req.body;
  const teacherId = req.user.id;

  try {
    const selectedDate = new Date(date);
    const now = new Date();

    // Prevent adding availability for past times on the same day
    if (selectedDate.toDateString() === now.toDateString()) {
      const validTimeSlots = timeSlots.filter((slot) => {
        const slotTime = new Date(`${selectedDate.toDateString()} ${slot.startTime}`);
        return slotTime > now; // Only keep future time slots
      });

      if (validTimeSlots.length === 0) {
        return res.status(400).json({ message: 'Cannot add past time slots on the current date.' });
      }

      timeSlots = validTimeSlots;
    }

    // Check for existing availability on the same date to prevent overlapping slots
    const existingAvailability = await Availability.findOne({ teacherId, date: selectedDate });

    if (existingAvailability) {
      const existingTimeSlots = existingAvailability.timeSlots;

      // Ensure no overlap between existing time slots and new time slots
      for (const newSlot of timeSlots) {
        for (const existingSlot of existingTimeSlots) {
          const existingStart = new Date(`${selectedDate.toDateString()} ${existingSlot.startTime}`);
          const existingEnd = new Date(`${selectedDate.toDateString()} ${existingSlot.endTime}`);
          const newStart = new Date(`${selectedDate.toDateString()} ${newSlot.startTime}`);
          const newEnd = new Date(`${selectedDate.toDateString()} ${newSlot.endTime}`);

          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd)
          ) {
            return res.status(400).json({ message: 'Cannot add overlapping time slots.' });
          }
        }
      }

      // Update existing availability
      existingAvailability.timeSlots = [...existingTimeSlots, ...timeSlots];
      await existingAvailability.save();
      return res.status(201).json({ message: 'Availability updated successfully', availability: existingAvailability });
    }

    // Create new availability if none exists for the date
    const availability = new Availability({
      teacherId,
      date: selectedDate,
      timeSlots,
    });

    await availability.save();
    res.status(201).json({ message: 'Availability updated successfully', availability });
  } catch (error) {
    console.error('Error updating availability:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a specific availability entry
exports.deleteAvailability = async (req, res) => {
  const { availabilityId } = req.params;
  const teacherId = req.user.id;

  try {
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    if (availability.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await availability.deleteOne();
    res.json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
