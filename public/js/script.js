document.addEventListener('DOMContentLoaded', () => {
  const createPostForm = document.getElementById('createPostForm');
  const postList = document.getElementById('postList');

  createPostForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(createPostForm);
    const title = formData.get('title');
    const content = formData.get('content');

    try {
      const response = await fetch('/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      createPostForm.reset();
      renderPost(newPost);
    } catch (error) {
      console.error(error);
    }
  });

  const fetchPosts = async () => {
    try {
      const response = await fetch('/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const posts = await response.json();
      posts.forEach((post) => {
        renderPost(post);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderPost = (post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p>Username: ${post.username}</p>
      <p>Like: <span id="likeCount-${post._id}">${post.likeCount}</span></p>
      <button onclick="handleLike('${post._id}')">Like</button>
      <p>Dislike: <span id="dislikeCount-${post._id}">${post.dislikeCount}</span></p>
      <button onclick="handleDislike('${post._id}')">Dislike</button>
    `;
    postList.appendChild(postElement);
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update like count');
      }

      const { likeCount } = await response.json();
      const likeCountElement = document.getElementById(`likeCount-${postId}`);
      likeCountElement.textContent = likeCount;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(`/posts/${postId}/dislike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update dislike count');
      }

      const { dislikeCount } = await response.json();
      const dislikeCountElement = document.getElementById(`dislikeCount-${postId}`);
      dislikeCountElement.textContent = dislikeCount;
    } catch (error) {
      console.error(error);
    }
  };

  fetchPosts();
});

