
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const router = express.Router();
const {auth,authAdmin} = require('../Middleware/authMiddleware');
const Movie = require('../Model/Movie');
const userController = require('../Controller/UserController');


router.post('/register', userController.registerUser);

router.post('/login',userController.loginUser);

router.put('/setPref', auth, userController.setPreference); 

router.put('/updateProfile', auth, userController.UpdateProfile);

router.put('/addToWishlist', auth, userController.AddToWishList);

module.exports = router;
