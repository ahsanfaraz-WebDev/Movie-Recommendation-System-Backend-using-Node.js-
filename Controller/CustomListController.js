// Controllers/CustomListController.js
const mongoose = require("mongoose");
const CustomList = require("../Model/CustomList");
const User = require("../Model/User");

const createCustomList = async (req, res) => {
  const { name, description, movies, isPublic } = req.body;

  try {
    const newCustomList = new CustomList({
      name,
      description,
      creator: req.userId,
      movies,
      isPublic,
    });

    await newCustomList.save();
    res.status(201).json({
      message: "Custom list created successfully",
      customList: newCustomList,
    });
  } catch (err) {
    console.error("Error creating custom list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyLists = async (req, res) => {
  try {
    const myLists = await CustomList.find({ creator: req.userId });
    res.status(200).json(myLists);
  } catch (err) {
    console.error("Error fetching user lists:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomListById = async (req, res) => {
  const listId = req.params.id;

  // Check if the listId is a valid ObjectId or if it's "following"
  if (listId === "following") {
    return getFollowingLists(req, res);
  }

  try {
    const customList = await CustomList.findOne({
      _id: listId,
      $or: [{ isPublic: true }, { creator: req.userId }],
    }).populate("movies", "title genre director");

    if (!customList) {
      return res
        .status(404)
        .json({ message: "Custom list not found or access denied" });
    }

    res.status(200).json(customList);
  } catch (err) {
    console.error("Error fetching custom list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addMovieToCustomList = async (req, res) => {
  const { movieId } = req.body;
  const listId = req.params.id;

  try {
    const customList = await CustomList.findOneAndUpdate(
      { _id: listId, creator: req.userId },
      { $addToSet: { movies: movieId } },
      { new: true }
    );

    if (!customList) {
      return res
        .status(404)
        .json({ message: "Custom list not found or access denied" });
    }

    res.status(200).json({ message: "Movie added to custom list", customList });
  } catch (err) {
    console.error("Error adding movie to custom list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const followCustomList = async (req, res) => {
  const listId = req.params.id;

  try {
    const customList = await CustomList.findById(listId);
    if (!customList) {
      return res.status(404).json({ message: "Custom list not found" });
    }

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { followingLists: listId },
    });
    customList.followers.addToSet(req.userId);
    await customList.save();

    res.status(200).json({ message: "You are now following this custom list" });
  } catch (err) {
    console.error("Error following custom list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const unfollowCustomList = async (req, res) => {
  const listId = req.params.id;

  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { followingLists: listId },
    });
    await CustomList.findByIdAndUpdate(listId, {
      $pull: { followers: req.userId },
    });

    res.status(200).json({ message: "You have unfollowed this custom list" });
  } catch (err) {
    console.error("Error unfollowing custom list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowingLists = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "followingLists",
      populate: { path: "movies", select: "title genre" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.followingLists);
  } catch (err) {
    console.error("Error fetching followed custom lists:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCustomList,
  getMyLists,
  getCustomListById,
  addMovieToCustomList,
  followCustomList,
  unfollowCustomList,
  getFollowingLists,
};
