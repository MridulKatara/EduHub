const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const typeDefs = require('./graphql/schema');
const bookResolver = require('./resolvers/bookResolver');
const userResolver = require('./resolvers/userResolver');
const authResolver = require('./resolvers/authResolver');
const db = require('./config/db');

dotenv.config();

// Connect to MongoDB
db.connectDB();

// Create an Express application
const app = express();

// Combine all resolvers into an array
const resolvers = [bookResolver, userResolver, authResolver];

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers, // Include the resolvers array
  context: ({ req }) => {
    // Additional context setup if needed
  },
});

// Apply middleware to Express app
server.applyMiddleware({ app });

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
