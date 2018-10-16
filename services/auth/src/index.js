const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const gqlServerConfig = require('./api');

require('./db/db-connect')('mongodb://auth-db:27017/auth', {
  user: 'shawn',
  pass: 'shawn',
  useNewUrlParser: true,
}).then(() => console.log('connected to db')).catch(e => console.error(e));

const server = new ApolloServer(gqlServerConfig);

const app = express();
server.applyMiddleware({ app });

app.get('/refresh', (req, res) => {
  res.send({
    user: 'user',
    token: 'token',
    refToken: 'refToken',
  });
});

app.listen({ port: 3030 }, () => {
  console.log('running on 3030');
});
