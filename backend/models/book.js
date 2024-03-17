// bookTypeDefs.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    _id: ID!
    title: String!
    author: String!
    description: String!
    owner: User
  }

  extend type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  extend type Mutation {
    addBook(title: String!, author: String!, description: String!): Book!
  }
`;

module.exports = typeDefs;
