const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController');

// Route to register a new user
router.post('/register', registerUser);

// Route to log in and get a JWT token
router.post('/login', loginUser);

module.exports = router;
