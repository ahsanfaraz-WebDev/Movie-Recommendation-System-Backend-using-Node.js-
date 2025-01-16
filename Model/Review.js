const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  rating: { type: Number, required: true, min: 1, max: 5 }, // rating from 1 to 5
  reviewText: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
