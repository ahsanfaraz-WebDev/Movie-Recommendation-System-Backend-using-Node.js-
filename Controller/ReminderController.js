// Controllers/ReminderController.js
const Movie = require('../Model/Movie');
const Notification = require('../Model/Notification');

// Get upcoming movies
const getUpcomingMovies = async (req, res) => {
  try {
    const upcomingMovies = await Movie.find({ releaseDate: { $gte: new Date() } })
      .sort({ releaseDate: 1 }) // Sort by upcoming release date
      .limit(10);
    res.status(200).json(upcomingMovies);
  } catch (err) {
    console.error('Error fetching upcoming movies:', err);
    res.status(500).json({ message: 'Error fetching upcoming movies.' });
  }
};

// Set reminder for new movie release
const setReminder = async (req, res) => {
  const { movieId, reminderDate } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });

    const newReminder = new Notification({
      user: req.userId, // Assuming `req.userId` contains the authenticated user's ID
      movie: movieId,
      reminderDate: new Date(reminderDate),
    });

    await newReminder.save();
    res.status(200).json({ message: 'Reminder set successfully.' });
  } catch (err) {
    console.error('Error setting reminder:', err);
    res.status(500).json({ message: 'Error setting reminder.' });
  }
};

module.exports = {
  getUpcomingMovies,
  setReminder,
};
