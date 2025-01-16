const mongoose = require('mongoose'); 

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now },
  forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true }, // Reference to the Forum model
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
