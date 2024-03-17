const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/resolvers');
const db = require('./config/db');

dotenv.config();

async function startApolloServer() {
  // Connect to MongoDB
  await db.connectDB();

  // Create an Express application
  const app = express();

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Additional context setup if needed
    },
  });

  // Start the Apollo Server
  await server.start();

  // Apply middleware to Express app
  server.applyMiddleware({ app });

  // Start the Express server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startApolloServer().catch(err => console.error(err));
