import "cross-fetch/polyfill";
import gql from "graphql-tag";

import prisma from "../src/prisma";
import seedDatabase from './utils/seedDatabase';
import getClient from "./utils/getClient";

const client = getClient();

beforeEach(seedDatabase);

test("should return only published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        published
      }
    }
  `;

  const response = await client.query({ query: getPosts });
  const [pubPost] = response.data.posts;
  expect(response.data.posts.length).toBe(1);
  expect(pubPost.published).toBe(true);
});