const mongoose = require('mongoose');

const customListSchema = new mongoose.Schema({
  name: { type: String, required: true }, // List title, e.g., "Best Horror Movies"
  description: { type: String }, // Optional description for the list
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Array of movie references
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who follow this list
  isPublic: { type: Boolean, default: true }, // If true, other users can view the list
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CustomList', customListSchema);
