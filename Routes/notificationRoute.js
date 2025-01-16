// Routes/notificationRoute.js
const express = require('express');
const notificationController = require('../Controller/NotificationController');
const router = express.Router();

// Notify users about upcoming movie releases
router.post('/notify-upcoming', notificationController.notifyUpcomingReleases);

module.exports = router;
