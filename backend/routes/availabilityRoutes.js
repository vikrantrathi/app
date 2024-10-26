const express = require('express');
const {
  addAvailability,
  getAvailability,
  deleteAvailability,
  deleteSlot,
} = require('../controllers/availabilityController'); // Ensure this path and import are correct
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Add or update availability for a date
router.post('/add', authMiddleware, addAvailability);

// Get availability for a teacher
router.get('/', authMiddleware, getAvailability);

// Delete a specific availability entry
router.delete('/:availabilityId', authMiddleware, deleteAvailability);
// Route to delete a specific slot
router.post('/:availabilityId/deleteSlot', authMiddleware, deleteSlot);
module.exports = router;
