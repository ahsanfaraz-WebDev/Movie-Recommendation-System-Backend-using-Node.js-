const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const router = express.Router();
const { auth, authAdmin } = require("../Middleware/authMiddleware");
const Movie = require("../Model/Movie");
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (role !== "admin" && role !== "user") {
      return res.status(400).json({ message: "Invalid User Role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_default_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const setPreference = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Auth Error" });
  }

  // Find the user by ID
  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user is an admin
  if (user.role === "admin") {
    return res.status(403).json({ message: "Admins cannot set preferences" });
  }

  const { genres, actors } = req.body;

  if (Array.isArray(genres)) {
    genres.forEach((genre) => {
      if (!user.preferences.genres.includes(genre)) {
        user.preferences.genres.push(genre);
      }
    });
  } else if (genres) {
    if (!user.preferences.genres.includes(genres)) {
      user.preferences.genres.push(genres);
    }
  }

  if (Array.isArray(actors)) {
    actors.forEach((actor) => {
      if (!user.preferences.actors.includes(actor)) {
        user.preferences.actors.push(actor);
      }
    });
  } else if (actors) {
    if (!user.preferences.actors.includes(actors)) {
      user.preferences.actors.push(actors);
    }
  }

  await user.save();

  res.status(200).json({ message: "Preferences updated successfully" });
};
const UpdateProfile = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Auth Error" });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Restrict admin from updating profile
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot update profile" });
    }

    const { username, email, password } = req.body;

    // Email and password validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // Update username if provided and check for duplicates
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    // Update email if provided and check for duplicates
    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and include at least one letter, one number, and one special character",
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    // Save updates if any
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const AddToWishList = async (req, res) => {
  const { movieTitle } = req.body; // Movie title to add to wishlist

  if (!movieTitle) {
    return res.status(400).json({ message: "Movie title is required" });
  }

  try {
    const movie = await Movie.findOne({ title: movieTitle });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find the user
    const user = await User.findById(req.userId); // Assuming req.userId is set by the auth middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie is already in the wishlist
    if (user.wishlist.includes(movie._id)) {
      return res.status(400).json({ message: "Movie is already in wishlist" });
    }

    // Add the movie's ObjectId to the wishlist
    user.wishlist.push(movie._id);
    await user.save();

    res
      .status(200)
      .json({ message: "Movie added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("Error adding movie to wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  setPreference,
  UpdateProfile,
  AddToWishList,
};
