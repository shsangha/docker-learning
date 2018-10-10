const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { mergeSchemas } = require('graphql-tools');
const { getIntrospectedSchema } = require('./introspect');

const app = express();

const remoteEndpoints = [
  'http://localhost:4000/graphql',
];


(async function startServer() {
  try {
    const allSchemas = await Promise.all(remoteEndpoints.map(ep => getIntrospectedSchema(ep)));
    const server = new ApolloServer({ schema: mergeSchemas({ schemas: allSchemas }) });
    server.applyMiddleware({ app });
    app.listen({ port: 3030 }, () => {
      console.log('gateway at 3030');
    });
  } catch (e) {
    console.error(e);
  }
}());
