// Controllers/NotificationController.js
const User = require('../Model/User');
const Movie = require('../Model/Movie');

const notifyUpcomingReleases = async (req, res) => {
  try {
    // Get all users (optionally filter by preferences)
    const users = await User.find();

    // Find upcoming movies with release dates today or later
    const upcomingMovies = await Movie.find({ 
      releaseDate: { $gte: new Date() } 
    });

    if (upcomingMovies.length === 0) {
      return res.status(200).json({ message: 'No upcoming movies' });
    }

    // Create notification messages for each movie
    const notifications = upcomingMovies.map(movie => 
      `Movie Title: ${movie.title}, Releasing on: ${movie.releaseDate.toDateString()}`
    );

    // Add notifications to each user's Notifications array
    for (const user of users) {
      if (user) {
        user.Notifications.push(...notifications); // Spread notifications
        await user.save(); // Save updated user
      }
    }

    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (err) {
    console.error('Error sending notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  notifyUpcomingReleases,
};
