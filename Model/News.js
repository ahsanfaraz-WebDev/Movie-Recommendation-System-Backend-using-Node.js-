const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,  // Category could be "Movies", "Actors", "Industry", etc.
      enum: ['Movies', 'Actors', 'Industry'],
      required: true
    },
    imageUrl: {
      type: String,  // Optional: to store an image URL for news articles
      default: ''
    },
    author: {
      type: String,  // Can store the name of the author
      required: true
    },
    datePublished: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('News', newsSchema);
