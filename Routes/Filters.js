// Routes/movieFilterRoute.js
const express = require('express');
const movieFilterController = require('../Controller/SearchAndFilterController');
const router = express.Router();

// Search and filter movies
router.get('/search', movieFilterController.searchMovies);

// Top Movies of the Month
router.get('/top/month', movieFilterController.topMoviesOfTheMonth);

// Top 10 Movies by Genre
router.get('/top/:genre', movieFilterController.topMoviesByGenre);

// Get box office info for a movie
router.get('/:id/boxoffice', movieFilterController.getBoxOfficeInfo);

module.exports = router;
