import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";
import jwt from 'jsonwebtoken';


const userOne = {
  input: {
    name: "Jen",
    email: "jen@email.com",
    password: bcrypt.hashSync("hdjahsdfasdf")
  },
  user: undefined,
  jwt: undefined
};

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
  const postPublished = await prisma.mutation.createPost({
    data: {
      title: "Living la vida loca",
      body: "Shrek, Donkey and Puss in boots",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  const postDraft = await prisma.mutation.createPost({
    data: {
      title: "Madagascar",
      body: "Kowalski analysis",
      published: false,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
}



export { seedDatabase as default, userOne };