// Controllers/AdminController.js
const User = require('../Model/User');
const Movie = require('../Model/Movie');
const Profile = require('../Model/Profile');

const viewAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Compare this snippet from Movie-Recommendation-System-Backend-using-Node.js-/Controller/CustomListController.js:

const viewAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const viewAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTrendingGenres = async (req, res) => {
  try {
    const genresCount = await Movie.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json(genresCount);
  } catch (err) {
    console.error('Error fetching trending genres:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPopularMovies = async (req, res) => {
  try {
    const popularMovies = await Movie.find().sort({ averageRating: -1 }).limit(5);
    res.status(200).json(popularMovies);
  } catch (err) {
    console.error('Error fetching popular movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const activeUsers = await User.find().sort({ lastLogin: -1 }).limit(5);
    res.status(200).json(activeUsers);
  } catch (err) {
    console.error('Error fetching active users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  viewAllUsers,
  viewAllMovies,
  viewAllProfiles,
  getTrendingGenres,
  getPopularMovies,
  getActiveUsers
};
