// Routes/adminRoute.js
const express = require("express");
const User = require("../Model/User");
const Movie = require("../Model/Movie");
const Profile = require("../Model/Profile");
const Review = require("../Model/Review");
const { auth, authAdmin } = require("../Middleware/authMiddleware");
const mongoose = require("mongoose");

const AddMovie = async (req, res) => {
  const {
    title,
    genre,
    director,
    cast,
    releaseDate,
    runtime,
    synopsis,
    averageRating,
    trivia,
    goofs,
    soundtrack,
    ageRating,
    boxOffice,
    awards,
  } = req.body;

  try {
    const newMovie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      averageRating,
      trivia,
      goofs,
      soundtrack,
      ageRating,
      boxOffice,
      awards,
    });

    await newMovie.save();
    res
      .status(201)
      .json({ message: "Movie added successfully", movie: newMovie });
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const DeleteMovie = async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    // Find and update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { $set: req.body }, // Update movie with data in req.body
      { new: true, runValidators: true } // Return the updated movie and apply validation
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  AddMovie,
  DeleteMovie,
  updateMovie,
};
