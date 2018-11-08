const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { mergeSchemas } = require('graphql-tools');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middlewares/auth');
const { getIntrospectedSchema } = require('./introspect');

const app = express();

const remoteEndpoints = ['http://localhost:3030/graphql'];

(async function runMergedSchema() {
  try {
    const schemas = await Promise.all(remoteEndpoints.map(ep => getIntrospectedSchema(ep)));
    const server = new ApolloServer({
      schema: mergeSchemas({ schemas }),
      context: ({ req }) => ({
        token: req.headers['x-token'],
        refToken: req.headers['x-refresh-token']
      })
    });
    //  app.use(authMiddleware);
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () => {
      console.log('gateway at 4000 up and running');
    });
  } catch (e) {
    console.error(e);
  }
})();
