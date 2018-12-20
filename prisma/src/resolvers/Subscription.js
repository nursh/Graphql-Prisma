import getUserId from "../utils/getUserId";

const Subcription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      const opArgs = {
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      };
      return prisma.subscription.comment(opArgs, info);
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      const opArgs = {
        where: {
          node: {
            published: true
          }
        }
      };
      return prisma.subscription.post(opArgs, info);
    }
  },
  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        },
        info
      );
    }
  }
};

export { Subcription as default };
