const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    server.applyMiddleware({ app });
    app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
});