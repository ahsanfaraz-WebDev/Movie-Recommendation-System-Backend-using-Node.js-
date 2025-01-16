// Routes/adminRoute.js
const express = require('express');
const { auth, authAdmin } = require('../Middleware/authMiddleware');
const movieController = require('../Controller/MovieController');
const profileController = require('../Controller/ProfileController');
const reviewController = require('../Controller/ReviewController');
const adminController = require('../Controller/AdminController');
const router = express.Router();

// Movie routes
router.post('/movies', auth, authAdmin, movieController.AddMovie);
router.put('/movies/:id', auth, authAdmin, movieController.updateMovie);
router.delete('/movies/:id', auth, authAdmin, movieController.DeleteMovie);

// Profile routes
router.post('/profiles', auth, authAdmin, profileController.addProfile);
router.put('/profiles/:id', auth, authAdmin, profileController.updateProfile);
router.delete('/profiles/:id', auth, authAdmin, profileController.deleteProfile);

// Review route
router.delete('/reviews/:id', auth, authAdmin, reviewController.deleteReview);

// Admin views
router.get('/users', auth, authAdmin, adminController.viewAllUsers);
router.get('/movies', auth, authAdmin, adminController.viewAllMovies);
router.get('/profiles', auth, authAdmin, adminController.viewAllProfiles);

// Admin insights
router.get('/stats/trending-genres', auth, authAdmin, adminController.getTrendingGenres);
router.get('/stats/popular-movies', auth, authAdmin, adminController.getPopularMovies);
router.get('/stats/active-users', auth, authAdmin, adminController.getActiveUsers);

module.exports = router;
