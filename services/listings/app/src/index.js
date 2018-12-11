const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./api/listings');
const seed = require('../seed');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.headers['x-user']
    };
  }
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 3030 }, () => {
  console.log('listing service running on 3030');
});
