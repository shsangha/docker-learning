const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('../src/api');

module.exports = (context = {}) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
};
