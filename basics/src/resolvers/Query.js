const Query = {
  me() {
    return {
      id: "djhasidufhasdf",
      name: "Mickey",
      email: "Mick@example.com",
      age: 3
    };
  },
  post() {
    return {
      id: "jsdhaduabsdfa",
      title: "Asking for a friend",
      body: "What do you think about otters and their mating habits...",
      published: false
    };
  },
  users(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.users;

    return db.users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.posts;
    return db.posts.filter(post => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());
      return isBodyMatch || isTitleMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export { Query as default };
