const Comment = {
  author(parent, args, { db }, info) {
    const { author: authorId } = parent;
    return db.users.find(user => user.id === authorId);
  },
  post(parent, args, { db }, info) {
    const { post: postId } = parent;
    return db.posts.find(post => post.id === postId);
  }
};

export { Comment as default };
