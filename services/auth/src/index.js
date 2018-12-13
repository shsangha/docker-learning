const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const { typeDefs, resolvers, userModel } = require('./api');
const router = require('./routes');
const refreshTokens = require('./api/auth/auth.helpers/refreshTokens');

require('./db/db-connect')('mongodb://auth-db:27017/auth?authSource=admin', {
  user: 'root',
  pass: 'root',
  useNewUrlParser: true
})
  .then(() => console.log('connected to db'))
  .catch(e => console.error(e));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      models: {
        User: userModel
      },
      User: req.headers['x-user'] || null
    };
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.get('/before', (req, res) => {
  res.send('before');
});

server.applyMiddleware({ app });
app.get('/after', (req, res) => {
  res.send('after');
});
app.listen({ port: 3030 }, () => {
  console.log('running on 3030');
});
