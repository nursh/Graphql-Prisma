import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data;
    const opArgs = {
      where: {
        email
      }
    };

    const user = await prisma.query.user(opArgs);
    if (!user) throw new Error("Unable to login");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Password is not correct");

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async createUser(parent, args, { prisma }, info) {

    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) throw new Error("Email taken");

    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return {
      user,
      token: generateToken(user.id)
    };
  },
  async updateUser(parent, args, { prisma, request }, info) {
    // You don't need the error checking, it's just to provide a better error message
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    const opArgs = {
      where: {
        id: userId
      },
      data: args.data
    };
    return prisma.mutation.updateUser(opArgs, info);
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const userExists = await prisma.exists.User({ id: userId });
    if (!userExists) throw new Error("User not found");

    const opArgs = {};
    opArgs.where = {
      id: userId
    };
    const user = await prisma.mutation.deleteUser(opArgs, info);
    return user;
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const userExists = await prisma.exists.User({ id: args.data.author });
    if (!userExists) throw new Error("user not found");

    const { title, body, published, author } = args.data;
    const opArgs = {
      data: {
        title,
        body,
        published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    };
    const post = await prisma.mutation.createPost(opArgs, info);
    return post;
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if (!postExists) throw new Error("Post not found");

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      });
    }

    const opArgs = {
      where: {
        id: args.id
      },
      data: args.data
    };
    return prisma.mutation.updatePost(opArgs, info);
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!postExists) throw new Error("Unable to delete Post");
    const opArgs = {
      where: {
        id: args.id
      }
    };
    return prisma.mutation.deletePost(opArgs, info);
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });
    if (!postExists) throw new Error("Post not found");
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) throw new Error("Unable to update comment");
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });
    if (!commentExists) throw new Error("Unable to delete comment");
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

export { Mutation as default };
