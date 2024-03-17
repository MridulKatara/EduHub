const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    address: String!
    photo: String!
    role: String!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    registerUser(name: String!, email: String!, age: Int!, address: String!, photo: String!, password: String!, confirmPassword: String!): User!
    updateUser(id: ID!, name: String!, age: Int!, address: String!, photo: String!): User!
    deleteUser(id: ID!): User!
  }
`;

module.exports = typeDefs;
