// Add an event listener to all "Hide Comments" buttons
const hideCommentsButtons = document.querySelectorAll(".hide-comments-btn");
hideCommentsButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const postId = this.getAttribute("data-post-id");
    const commentList = document.querySelector(
      `.post[data-post-id="${postId}"] .comment-list`
    );
    const loadMoreButton = document.querySelector(
      `.post[data-post-id="${postId}"] .load-more-comments`
    );
    const showCommentsButton = document.querySelector(
      `.post[data-post-id="${postId}"] .show-comments-btn`
    );
    const hideCommentsButton = this;
    commentList.classList.add("hide");
    loadMoreButton.classList.add("hide");
    showCommentsButton.classList.remove("hide");
    hideCommentsButton.classList.add("hide");
  });
});

/// Add an event listener to all "Show Comments" buttons
const showCommentsButtons = document.querySelectorAll(".show-comments-btn");
showCommentsButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    const postId = this.getAttribute("data-post-id");
    const commentList = document.querySelector(
      `.post[data-post-id="${postId}"] .comment-list`
    );
    const loadMoreButton = document.querySelector(
      `.post[data-post-id="${postId}"] .load-more-comments`
    );
    const showCommentsButton = document.querySelector(
      `.post[data-post-id="${postId}"] .show-comments-btn`
    );
    const hideCommentsButton = document.querySelector(
      `.post[data-post-id="${postId}"] .hide-comments-btn`
    );

    try {
      const response = await fetch(`/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const comments = await response.json();

      // Clear existing comments
      commentList.innerHTML = "";

      // Sort comments by time in ascending order
      comments.sort((a, b) => new Date(a.time) - new Date(b.time));

      // Render the comments
      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.classList.add("comment");

        // Create elements for comment details
        const commentDetails = document.createElement("div");
        commentDetails.classList.add("comment-details");

        const commentUser = document.createElement("span");
        commentUser.classList.add("comment-user");
        commentUser.textContent = comment.username;

        const commentDate = document.createElement("span");
        commentDate.classList.add("comment-date");
        commentDate.textContent = comment.time;

        // Append comment user and comment date to comment details
        commentDetails.appendChild(commentUser);
        commentDetails.appendChild(commentDate);

        // Create element for comment content
        const commentContent = document.createElement("div");
        commentContent.classList.add("comment-content");
        commentContent.textContent = comment.content;

        // Append comment details and comment content to the comment item
        commentItem.appendChild(commentDetails);
        commentItem.appendChild(commentContent);

        commentList.appendChild(commentItem);
      });

      // Show/hide appropriate buttons
      commentList.classList.remove("hide");
      loadMoreButton.classList.remove("hide");
      showCommentsButton.classList.add("hide");
      hideCommentsButton.classList.remove("hide");
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  });
});

// Add an event listener to all "Load More" buttons
const loadMoreButtons = document.querySelectorAll(".load-more-comments");
loadMoreButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    const postId = this.getAttribute("data-post-id");
    const commentList = document.querySelector(
      `.post[data-post-id="${postId}"] .comment-list`
    );

    try {
      // Calculate the current number of comments
      const currentCommentCount = commentList.children.length;

      // Fetch the next 5 comments
      const response = await fetch(
        `/api/posts/${postId}/comments?skip=${currentCommentCount}&limit=5`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const comments = await response.json();

      // Render the additional comments
      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.textContent = comment.content;
        commentList.appendChild(commentItem);
      });
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  });
});
