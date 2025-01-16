const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    genres: [{ type: String }],
    actors: [{ type: String }],
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  dateJoined: { type: Date, default: Date.now },

  followingLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomList" }],

  Notifications: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
