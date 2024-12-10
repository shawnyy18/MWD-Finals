const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDetails, updateUserDetails, updateUserPassword } = require('../controllers/User-Controllers');
const auth = require('../auth.js'); // Import auth.js

// Define the route for registering a user
router.post('/register', registerUser);

// Define the route for logging in a user
router.post('/login', loginUser);

// Define the route for getting user details
router.get('/details', auth.verify, getUserDetails);

// Define the route for updating user details
router.put('/update-details', auth.verify, updateUserDetails);

// Define the route for updating user password
router.put('/update-password', auth.verify, updateUserPassword);

module.exports = router;