const express = require("express");
const { auth } = require("../Middleware/authMiddleware");
const customListController = require("../Controller/CustomListController");
const router = express.Router();

// Custom list routes
router.post("/", auth, customListController.createCustomList);
router.get("/my-lists", auth, customListController.getMyLists);
router.get("/:id", auth, customListController.getCustomListById);
router.put("/:id/add-movie", auth, customListController.addMovieToCustomList);
router.put("/:id/follow", auth, customListController.followCustomList);
router.put("/:id/unfollow", auth, customListController.unfollowCustomList);

// Updated route for following lists
router.get("/following", auth, customListController.getFollowingLists); // Updated the route to /following instead of /:id/following

module.exports = router;
