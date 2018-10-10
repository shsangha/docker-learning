const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const gqlServerConfig = require('./api');
require('./db/db-connect')('mongodb://auth-db:27017/auth', {
  user: 'shawn',
  pass: 'shawn',
  newUrlParser: true,
}).then(() => console.log('connected to db')).catch(e => console.error(e));

const server = new ApolloServer(gqlServerConfig);

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log('running on 4000');
});
