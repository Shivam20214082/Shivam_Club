const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/create', (req, res) => {
  res.render('create-post');
});

// Create a new post
router.post('/create', (req, res) => {
  const { title, content } = req.body;
  const { username } = req.session;

  const newPost = new Post({ title, content, username });

  newPost
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error('Failed to create post:', error);
      res.redirect('/');
    });
});

// Like a post
// Like a post
router.post('/like/:postId', (req, res) => {
  const { postId } = req.params;
  const { username } = req.session;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.error('Failed to find post');
        res.redirect('/');
      } else if (post.likes.includes(username)) {
        console.log('User already liked the post');
        res.redirect('/');
      } else {
        // Update the post with the new like
        post.likes.push(username);

        post
          .save()
          .then(() => {
            res.redirect('/');
          })
          .catch((error) => {
            console.error('Failed to save post:', error);
            res.redirect('/');
          });
      }
    })
    .catch((error) => {
      console.error('Failed to find post:', error);
      res.redirect('/');
    });
});

module.exports = router;
