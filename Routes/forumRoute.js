// Routes/forumRoute.js
const express = require('express');
const forumController = require('../Controller/ForumController');
const { auth, authAdmin } = require('../Middleware/authMiddleware');
const router = express.Router();

// Create a new forum topic
router.post('/', auth, forumController.createForum);

// Get all forum topics
router.get('/', forumController.getForums);

// Get a single forum topic by ID
router.get('/:id', forumController.getForumById);

// Post a comment on a forum topic
router.post('/:forumId/comments', auth, forumController.postComment);

// Delete a forum topic (admin only)
router.delete('/:id', auth, authAdmin, forumController.deleteForum);

module.exports = router;
