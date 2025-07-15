// Dependencies and Modules
const express = require('express');
const userController = require('../controllers/users');
const { verify } = require("../auth");

//Routing Component
const router = express.Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', verify, userController.getProfile);

module.exports = router;