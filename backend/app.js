const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const typeDefs = require('./graphql/schema');
const resolvers = require('./resolvers/resolvers');
const db = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
db.connectDB();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract the user from the request headers
    const token = req.headers.authorization || '';
    const user = decodeToken(token);
    return { user };
  },
});

// Apply middleware to Express server
server.applyMiddleware({ app });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to your server!');
});

// Decode JWT token
const decodeToken = (token) => {
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  try {
    await db.disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error during server shutdown:', error);
    process.exit(1);
  }
});
