const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Create a new post (GET request)
router.get('/create', (req, res) => {
  res.render('create-post'); // Replace 'create-post' with the name of your create post view/template
});

// Create a new post
router.post('/create', async (req, res) => {
  const { title, content } = req.body;
  const { username } = req.session;

  try {
    const newPost = new Post({ title, content, username });
    await newPost.save();
    res.redirect('/');
  } catch (error) {
    console.error('Failed to create post:', error);
    res.redirect('/');
  }
});

// Edit a post
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

// Like a post
router.post('/like/:postId', async (req, res) => {
  const { postId } = req.params;
  const { username } = req.session;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Failed to find post');
      res.redirect('/');
      return;
    }

    if (post.likes.includes(username)) {
      console.log('User already liked the post');
      res.redirect('/');
      return;
    }

    post.likes.push(username);
    await post.save();
    res.redirect('/');
  } catch (error) {
    console.error('Failed to update like count:', error);
    res.redirect('/');
  }
});

// Add a comment to a post
router.post('/comment/:postId', async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { username } = req.session;

  console.log(username);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Failed to find post');
      res.redirect('/');
      return;
    }

    post.comments.push({ username, content: comment });
    await post.save();
    res.redirect('/');
  } catch (error) {
    console.error('Failed to add comment:', error);
    res.redirect('/');
  }
});



// Retrieve comments for a post
router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { skip = 0, limit = 5 } = req.query;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Failed to find post');
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const sortedComments = post.comments.sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort comments by time in descending order

    const comments = sortedComments.slice(skip, skip + limit).map(comment => {
      const formattedTime = new Date(comment.time).toLocaleString(); // Format the comment time using toLocaleString()

      return {
        username: comment.username,
        content: comment.content,
        time: comment.time
      };
    });

    res.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});



module.exports = router;
