// Controllers/ReviewController.js
const Review = require('../Model/Review');
const Movie = require('../Model/Movie');

// Add or update a review for a movie
const addOrUpdateReview = async (req, res) => {
  const { movieId, rating, reviewText } = req.body;
  const userId = req.userId;

  if (!movieId || !rating) {
    return res.status(400).json({ message: 'Movie ID and rating are required' });
  }

  try {
    let review = await Review.findOne({ user: userId, movie: movieId });

    if (review) {
      // Update the existing review
      review.rating = rating;
      review.reviewText = reviewText;
      await review.save();
      return res.status(200).json({ message: 'Review updated successfully', review });
    } else {
      // Create a new review
      review = new Review({
        user: userId,
        movie: movieId,
        rating,
        reviewText
      });
      await review.save();
      return res.status(201).json({ message: 'Review added successfully', review });
    }
  } catch (err) {
    console.error('Error adding/updating review:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews for a specific movie, including top-rated and most-discussed
const getReviewsForMovie = async (req, res) => {
  const { movieId } = req.params;

  try {
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'username')
      .sort({ date: -1 });

    // Get top-rated reviews (5-star reviews)
    const topRatedReviews = reviews.filter(review => review.rating === 5);

    // Sort by review length for most-discussed
    const mostDiscussedReviews = reviews.sort((a, b) => b.reviewText.length - a.reviewText.length).slice(0, 5);

    res.status(200).json({
      reviews,
      highlights: {
        topRated: topRatedReviews,
        mostDiscussed: mostDiscussedReviews
      }
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a review (optional, allows users to delete their reviews)
const deleteReview = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.userId;

  try {
    const review = await Review.findOneAndDelete({ user: userId, movie: movieId });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addOrUpdateReview,
  getReviewsForMovie,
  deleteReview
};
