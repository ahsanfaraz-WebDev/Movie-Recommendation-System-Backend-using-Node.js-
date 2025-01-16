const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  genre: [{ type: String }],
  director: { type: String },
  cast: [{ type: String }],
  releaseDate: { type: Date },
  runtime: { type: Number }, // in minutes
  synopsis: { type: String },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  trivia: [{ type: String }],
  goofs: [{ type: String }],
  soundtrack: [{ type: String }],
  ageRating: { type: String }, // e.g., PG, R, etc.
  boxOffice: {
    openingWeekend: { type: Number },
    totalEarnings: { type: Number },
    awards: [{ title: String, year: Number, type: String }],
    internationalRevenue: { type: Number }
  },
  awards: [{ type: String }], // e.g., Oscars, Golden Globe
});



module.exports = mongoose.model('Movie', movieSchema);
