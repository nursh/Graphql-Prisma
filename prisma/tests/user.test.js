import "cross-fetch/polyfill";
import gql from "graphql-tag";

import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Nura", email: "nura@email.com", password: "Nuradeens" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  const { id } = response.data;
  const userExists = await prisma.exists.User({ id });
  expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({
    query: getUsers
  });

  const [jenUser] = response.data.users;

  expect(response.data.users.length).toBe(1);
  expect(jenUser.email).toBe(null);
  expect(jenUser.name).toBe("Jen");
});

test("Should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "django@email.com", password: "jdshfkjdhss" }) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should not be able to create user with short password", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Dini", email: "dini@email.com", password: "dini" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  await expect(
    client.mutate({
      mutation: createUser
    })
  ).rejects.toThrow();
});

test("should fetch user profile", async () => {
  const client = getClient(userOne.jwt);
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;

  await client.query({ query: getProfile });
});
