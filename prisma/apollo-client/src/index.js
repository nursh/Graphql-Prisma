import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`;

client.query({ query: getUsers }).then(response => {
  let html = "";
  response.data.users.forEach(
    user =>
      (html += `
      <div>
        <h3>${user.name}</h3>
      <div>
    `)
  );
  document.getElementById("users").innerHTML = html;
});

client.query({ query: getPosts }).then(response => {
  let html = "";
  response.data.posts.forEach(
    post =>
      (html += `
        <div>
          <p><b>${post.title}</b> by <b>${post.author.name}</b></p>
        <div>
      `)
  );
  document.getElementById("posts").innerHTML = html;
});
