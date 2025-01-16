// Routes/reviewRoute.js
const express = require('express');
const { auth } = require('../Middleware/authMiddleware');
const reviewController = require('../Controller/ReviewController');
const router = express.Router();

// Add or update a review for a movie
router.post('/review', auth, reviewController.addOrUpdateReview);

// Get all reviews for a specific movie, including top-rated and most-discussed
router.get('/reviews/:movieId', reviewController.getReviewsForMovie);

// Delete a review (optional, allows users to delete their reviews)
router.delete('/review/:movieId', auth, reviewController.deleteReview);

module.exports = router;
