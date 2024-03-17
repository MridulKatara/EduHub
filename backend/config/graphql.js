const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const bookResolver = require('./resolvers/bookResolver');
const userResolver = require('./resolvers/userResolver');
const authResolver = require('./resolvers/authResolver');
const { verifyToken } = require('../utils/authentication');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Get the authorization token from the request headers
    const token = req.headers.authorization || '';

    // Verify the JWT token
    try {
      const user = verifyToken(token);
      return { user };
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  },
});

module.exports = server;
