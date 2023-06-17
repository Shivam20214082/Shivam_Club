const Post = require('../src/models/post');

// Controller actions
const postController = {
  // Get all posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.render('home', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.render('home', { error: 'Failed to fetch posts' });
    }
  },

  // Get a single post by ID
  getPostById: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.render('post', { error: 'Post not found' });
      }
      res.render('post', { post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.render('post', { error: 'Failed to fetch post' });
    }
  },

  // Create a new post
  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await Post.create({ title, content });
      res.redirect(`/posts/${post._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      res.render('post', { error: 'Failed to create post' });
    }
  }
};

module.exports = postController;
