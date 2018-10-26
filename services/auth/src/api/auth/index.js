const typeDefs = require('./auth.schema');
const resolvers = require('./auth.resolvers');
const model = require('./auth.model');

module.exports = {
  resolvers,
  typeDefs,
  model,
};
