// Controllers/ForumController.js
const Forum = require('../Model/Forum');
const Comment = require('../Model/Comment');

// Create a new forum topic
const createForum = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newForum = new Forum({
      title,
      description,
      author: req.userId,
      createdAt: new Date()
    });

    await newForum.save();
    res.status(201).json({ message: 'Forum topic created successfully', forum: newForum });
  } catch (err) {
    console.error('Error creating forum topic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all forum topics
const getForums = async (req, res) => {
  try {
    const forums = await Forum.find().populate('author', 'username').sort({ createdAt: -1 });
    res.status(200).json(forums);
  } catch (err) {
    console.error('Error fetching forum topics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single forum topic by ID
const getForumById = async (req, res) => {
  const forumId = req.params.id;

  try {
    const forum = await Forum.findById(forumId).populate('author', 'username').populate('comments');
    if (!forum) {
      return res.status(404).json({ message: 'Forum topic not found' });
    }

    res.status(200).json(forum);
  } catch (err) {
    console.error('Error fetching forum topic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post a comment on a forum topic
const postComment = async (req, res) => {
  const { forumId } = req.params;
  const { content } = req.body;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum topic not found' });
    }

    const newComment = new Comment({
      content,
      author: req.userId,
      forum: forumId,
      createdAt: new Date()
    });

    await newComment.save();
    forum.comments.push(newComment._id);
    await forum.save();

    res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a forum topic (admin only)
const deleteForum = async (req, res) => {
  const forumId = req.params.id;

  try {
    const forum = await Forum.findByIdAndDelete(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum topic not found' });
    }

    await Comment.deleteMany({ forum: forumId });

    res.status(200).json({ message: 'Forum topic deleted successfully' });
  } catch (err) {
    console.error('Error deleting forum topic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createForum,
  getForums,
  getForumById,
  postComment,
  deleteForum,
};
