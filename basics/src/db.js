const users = [
  {
    id: "1",
    name: "Abdon",
    email: "abdon@example.com",
    age: 99
  },
  {
    id: "2",
    name: "Idonoww",
    email: "ido@example.com",
    age: 5
  },
  {
    id: "3",
    name: "Afizz",
    email: "hunter@example.com",
    age: 1000
  }
];

const posts = [
  {
    id: "1",
    title: "The Prince of fragrance",
    body: "...",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Playing with fire",
    body: "...",
    published: false,
    author: "2"
  },
  {
    id: "3",
    title: "Igniting the flames of Azeroth",
    body: "...",
    published: false,
    author: "2"
  }
];

const comments = [
  {
    id: "aa",
    text: "Officer, this comment right here",
    author: "2",
    post: "1"
  },
  {
    id: "bb",
    text: "Role tide",
    author: "3",
    post: "1"
  },
  {
    id: "cc",
    text: "Break his arms",
    author: "1",
    post: "2"
  },
  {
    id: "dd",
    text: `It don't be like that but it do`,
    author: "1",
    post: "3"
  }
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };