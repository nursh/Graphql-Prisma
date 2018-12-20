import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { email } = args.data;
    const emailTaken = db.users.some(user => user.email === email);
    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.users.push(user);
    return user;
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const { name, age, email } = data;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof email === "string") {
      const emailTaken = db.users.some(user => user.email === email);

      if (emailTaken) {
        throw new email("Email taken");
      }

      user.email = email;
    }

    if (typeof name === "string") user.name = name;
    if (typeof age !== undefined) user.age = age;

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { author: authorId } = args.data;
    const userExists = db.users.some(user => user.id === authorId);
    if (!userExists) {
      throw new Error("user not found");
    }
    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const { title, body, published } = data;

    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };
    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof title === "string") post.title = title;
    if (typeof body === "string") post.body = body;
    if (typeof published === "boolean") {
      post.published = published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { post: postId, author: authorId } = args.data;
    const userExists = db.users.some(user => user.id === authorId);
    const postExists = db.posts.some(
      post => post.id === postId && post.published
    );

    if (!userExists) throw new Error("User not found");
    if (!postExists) throw new Error("Post not found");

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${postId}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const { text } = data;

    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof text === "string") comment.text = text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    const userIndex = db.users.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error("User not found");

    const [deletedUser] = db.users.splice(userIndex, 1);

    posts = db.posts.filter(post => {
      const match = post.author === id;
      if (match) {
        comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter(comment => comment.author !== id);
    return deletedUser;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex === -1) throw new Error("Post does not exist");

    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== id);

    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost
        }
      });
    }

    return deletedPost;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const commentIndex = db.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) throw new Error("Comment does not exist");

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};

export { Mutation as default };
