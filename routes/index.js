const express = require('express');
const session = require('express-session');
const router = express.Router();
const Post = require('../models/post');

// Configure session middleware
router.use(
  session({
    secret: '1234567', // Replace with your own secret key for session encryption
    resave: false,
    saveUninitialized: false,
    authenticated:false,
  })
);

// Home route
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); 
    const authenticated = req.session.authenticated || false;
    const username = req.session.username || '';
    res.render('home', { posts, authenticated, username });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.render('home', { error: 'Failed to fetch posts' });
  }
});


// Logout route
router.get('/logout', (req, res) => {
  req.session.authenticated = false; // Clear the 'authenticated' flag in the session
  res.redirect('/');
});

module.exports = router;
