const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    owner: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    address: String!
    photo: String!
    role: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    addBook(title: String!, author: String!, description: String!): Book!
    addUser(name: String!, email: String!, age: Int!, address: String!, photo: String!, password: String!, confirmPassword: String!): User!
    registerUser(name: String!, email: String!, age: Int!, address: String!, photo: String!, password: String!, confirmPassword: String!): User! # Corrected mutation name
    updateUser(id: ID!, name: String!, age: Int!, address: String!, photo: String!): User!
    borrowBook(bookId: ID!, userId: ID!): Book!
    buyBook(bookId: ID!, userId: ID!): Book!
    requestBook(bookId: ID!, borrowerId: ID!): Book!
    deleteUser(id: ID!): User!
  }
`;

module.exports = typeDefs;
