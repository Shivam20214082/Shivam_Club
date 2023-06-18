const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Create a new post (GET request)
router.get('/create', (req, res) => {
  res.render('create-post'); // Replace 'create-post' with the name of your create post view/template
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

router.get('/edit/:postId', async (req, res) => {
  const { postId } = req.params;
  const { username } = req.session;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Failed to find post');
      res.redirect('/');
      return;
    }

    // Check if the current user is the creator of the post
    const isAuthor = (post.username === username);

    if (isAuthor) {
      res.render('edit-post', { post, isAuthor });
    } else {
      const referer = req.headers.referer;
      if (referer) {
        res.redirect(referer);
      } else {
        res.redirect('/');
      }
    }
  } catch (error) {
    console.error('Failed to fetch post:', error);
    res.redirect('/');
  }
});



// Update a post
router.post('/update/:postId', async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { username } = req.session;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Failed to find post');
      res.redirect('/');
      return;
    }

    // Check if the current user is the creator of the post
    if (post.username !== username) {
      console.log('User is not authorized to update this post');
      res.redirect('/');
      return;
    }

    post.title = title;
    post.content = content;

    await post.save();
    res.redirect('/');
  } catch (error) {
    console.error('Failed to update post:', error);
    res.redirect('/');
  }
});

module.exports = router;
