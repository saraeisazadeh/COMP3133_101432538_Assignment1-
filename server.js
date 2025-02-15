const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging: Ensure MONGO_URI is loaded

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const startServer = async () => {
  const app = express();
  app.use(express.json()); // Ensure JSON parsing for requests

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Updated: Remove deprecated options from mongoose.connect
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1); // Exit the app if MongoDB connection fails
    });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
