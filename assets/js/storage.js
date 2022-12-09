export function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

export function setPosts(posts, post = {}) {
  const postsToSave = Object.keys(post).length === 0 ? posts : [...posts, post];
  localStorage.setItem("posts", JSON.stringify(postsToSave));
}

export function deletePost(postId) {
  const posts = getPosts();
  const postIndex = posts.findIndex(
    (postItem) => postItem.id === parseInt(postId)
  );

  posts.splice(postIndex, 1);
  setPosts(posts);
}

export function getPostById(postId) {
  const posts = getPosts();
  const postIndex = posts.findIndex(
    (postItem) => postItem.id === parseInt(postId)
  );

  return posts[postIndex];
}
