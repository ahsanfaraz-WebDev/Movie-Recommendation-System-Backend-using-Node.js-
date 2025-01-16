// Routes/recommendationRoute.js
const express = require('express');
const { auth } = require('../Middleware/authMiddleware'); // Authentication middleware
const recommendationController = require('../Controller/RecommendationController'); // Import the recommendation controller
const router = express.Router();

// Generate recommendations for the user
router.get('/', auth, recommendationController.generateRecommendations);

// Get similar movies based on a given movie ID
router.get('/movies/:id/similar', recommendationController.getSimilarMovies);

// Get trending movies
router.get('/movies/trending', recommendationController.getTrendingMovies);

// Get top-rated movies
router.get('/movies/top-rated', recommendationController.getTopRatedMovies);

// Get recommendations for a user
router.get('/recommendations/user', auth, recommendationController.getUserRecommendations);

module.exports = router;
