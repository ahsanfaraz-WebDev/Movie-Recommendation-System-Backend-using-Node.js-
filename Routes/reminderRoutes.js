// Routes/reminderRoute.js
const express = require('express');
const { auth } = require('../Middleware/authMiddleware'); // Authentication middleware
const reminderController = require('../Controller/ReminderController'); // Import the reminder controller
const router = express.Router();

// Get upcoming movies
router.get('/upcoming', reminderController.getUpcomingMovies);

// Set reminder for new movie release
router.post('/reminder', auth, reminderController.setReminder);

module.exports = router;
