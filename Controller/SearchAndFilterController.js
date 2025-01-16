// Controllers/MovieFilterController.js
const Movie = require('../Model/Movie');

// Search and filter movies
const searchMovies = async (req, res) => {
  const {
    title,
    genre,
    director,
    actors,
    minRating,
    maxRating,
    minPopularity,
    maxPopularity,
    releaseYear,
    releaseDecade,
    country,
    language,
    keywords,
    sortBy,
    limit = 10
  } = req.query;

  try {
    const filter = {};

    if (title) filter.title = new RegExp(title, 'i');
    if (genre) filter.genre = genre;
    if (director) filter.director = director;
    if (actors) filter.cast = { $in: actors.split(',') };
    if (minRating || maxRating) filter.averageRating = { $gte: minRating || 0, $lte: maxRating || 5 };
    if (minPopularity || maxPopularity) filter.popularity = { $gte: minPopularity || 0, $lte: maxPopularity || 100 };
    if (releaseYear) filter.releaseYear = releaseYear;
    if (releaseDecade) {
      filter.releaseDate = {
        $gte: new Date(`${releaseDecade}-01-01`),
        $lte: new Date(`${parseInt(releaseDecade) + 9}-12-31`)
      };
    }
    if (country) filter.country = country;
    if (language) filter.language = language;
    if (keywords) filter.keywords = { $regex: new RegExp(keywords, 'i') };

    const sortOptions = {};
    if (sortBy === 'top-rated') sortOptions.averageRating = -1;
    else if (sortBy === 'popularity') sortOptions.popularity = -1;
    else if (sortBy === 'releaseDate') sortOptions.releaseDate = -1;

    const movies = await Movie.find(filter).sort(sortOptions).limit(parseInt(limit));

    res.status(200).json(movies);
  } catch (err) {
    console.error('Error filtering movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Top Movies of the Month
const topMoviesOfTheMonth = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(new Date().setMonth(startOfMonth.getMonth() + 1));

    const topMovies = await Movie.find({
      averageRating: { $gte: 4 },
      lastReviewedDate: { $gte: startOfMonth, $lt: endOfMonth }
    })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json(topMovies);
  } catch (err) {
    console.error('Error fetching top movies of the month:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Top 10 Movies by Genre
const topMoviesByGenre = async (req, res) => {
  const { genre } = req.params;

  try {
    const topMoviesByGenre = await Movie.find({ genre })
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json(topMoviesByGenre);
  } catch (err) {
    console.error('Error fetching top movies by genre:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get box office info for a movie
const getBoxOfficeInfo = async (req, res) => {
  try {
    const boxOfficeInfo = await Movie.findOne({ _id: req.params.id });
    if (!boxOfficeInfo) return res.status(404).json({ message: 'Movie info not found.' });

    res.status(200).json(boxOfficeInfo.boxOffice);
  } catch (err) {
    console.error('Error fetching box office info:', err);
    res.status(500).json({ message: 'Error fetching box office info.' });
  }
};

module.exports = {
  searchMovies,
  topMoviesOfTheMonth,
  topMoviesByGenre,
  getBoxOfficeInfo,
};
