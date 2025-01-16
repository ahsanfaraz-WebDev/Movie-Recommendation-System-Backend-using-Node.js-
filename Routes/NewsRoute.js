// Routes/newsRoute.js
const express = require('express');
const newsController = require('../Controller/NewsController');
const { auth, authAdmin } = require('../Middleware/authMiddleware');
const router = express.Router();

// Create a new news article
router.post('/', auth, authAdmin, newsController.createNews);

// Get all news articles
router.get('/', newsController.getAllNews);

// Get a single news article by ID
router.get('/:id', newsController.getNewsById);

// Update a news article
router.put('/:id', auth, authAdmin, newsController.updateNews);

// Delete a news article
router.delete('/:id', auth, authAdmin, newsController.deleteNews);

module.exports = router;
