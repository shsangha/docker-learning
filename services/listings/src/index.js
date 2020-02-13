const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { typeDefs, resolvers, esClient } = require('./api');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // still need to add context for es and mongo
  context: ({ req }) => ({
    User: req.headers['x-user'] || null,
    esClient
  })
});

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 3030 }, () => {
  // eslint-disable-next-line no-console
  console.log('listing service launched on 3030');
});
