const express = require('express');
const router = express.Router();

// GET login page
router.get('/', (req, res) => {
  res.render('login');
});

// POST login form
const User = require('../models/user'); // Assuming you have a User model defined

// POST login form
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Search for the user in the database
    const user = await User.findOne({ username, password });

    if (user) {
      // Successful login
      req.session.authenticated = true; // Set the 'authenticated' flag in the session
      req.session.username = username; // Store the username in the session
      res.redirect('/');
    } else {
      // Invalid login
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error searching user:', error);
    res.render('login', { error: 'An error occurred. Please try again later.' });
  }
});

// POST registration form
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;

    // Validate if the required fields are present
    if (!username || !password || !email || !name) {
      return res.status(400).send('All fields are required');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('Username already taken');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).send('Email already taken');
    }

    // Create a new user
    const user = new User({ username, password, email, name });
    await user.save();

    req.session.authenticated = true; // Set the 'authenticated' flag in the session
    req.session.username = username; // Store the username in the session

    res.redirect('/'); // Replace '/' with the appropriate URL for the dashboard or home page after registration
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred while registering the user');
  }
});

module.exports = router;
