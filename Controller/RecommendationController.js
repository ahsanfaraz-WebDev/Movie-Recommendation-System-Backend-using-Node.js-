// Controllers/RecommendationController.js
const Movie = require('../Model/Movie');
const User = require('../Model/User');
const Recommendation = require('../Model/Recommendation');
// Generate recommendations for the user
const generateRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('preferences.genres');

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot get recommendations' });
    }

    const userGenres = user.preferences.genres;

    const recommendedMovies = await Movie.find({
      $or: [
        { genre: { $in: userGenres } },
        { averageRating: { $gte: 4 } }
      ]
    })
    .select('title genre director averageRating') // Select fields to display
    .limit(10);

    const recommendation = await Recommendation.findOneAndUpdate(
      { user: req.userId },
      { recommendedMovies: recommendedMovies.map(movie => movie._id), date: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Recommendations generated successfully',
      recommendedMovies // Return full movie data
    });
  } catch (err) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch similar movies based on a given movie ID
const getSimilarMovies = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const similarMovies = await Movie.find({
      _id: { $ne: movieId },
      $or: [
        { genre: { $in: movie.genre } },
        { director: movie.director }
      ]
    }).limit(10);

    res.status(200).json({ similarMovies });
  } catch (err) {
    console.error('Error fetching similar movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending movies
const getTrendingMovies = async (req, res) => {
  try {
    const trendingMovies = await Movie.find().sort({ averageRating: -1 }).limit(10);

    res.status(200).json({ trendingMovies });
  } catch (err) {
    console.error('Error fetching trending movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top-rated movies
const getTopRatedMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find().sort({ averageRating: -1 }).limit(10);
    res.status(200).json({ topRatedMovies });
  } catch (err) {
    console.error('Error fetching top-rated movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recommendations for a user
const getUserRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot get recommendations' });
    }

    const userRecommendations = await Recommendation.findOne({ user: req.userId })
      .populate({
        path: 'recommendedMovies',
        select: 'title genre director averageRating', // Select fields to include
      });

    if (!userRecommendations) {
      return res.status(404).json({ message: 'No recommendations found' });
    }

    res.status(200).json(userRecommendations.recommendedMovies);
  } catch (err) {
    console.error('Error fetching user recommendations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateRecommendations,
  getSimilarMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUserRecommendations,
};
