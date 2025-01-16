// Model/Profile.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },               // Name of the actor/crew member
  role: { type: String, required: true, enum: ['Actor', 'Director', 'Producer', 'Writer', 'Crew'] }, // Role in the industry
  biography: { type: String },                          // Brief biography
  filmography: [{ type: String }],                      // List of movies or projects they were part of
  awards: [{ type: String }],                           // List of awards won
  dateOfBirth: { type: Date },                          // Date of birth
  nationality: { type: String },                        // Nationality of the person
  knownFor: { type: [String] },                         // Known projects or roles
  photoUrl: { type: String }                            // URL to a profile picture or photo
});

module.exports = mongoose.model('Profile', profileSchema);
