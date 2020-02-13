const typeDefs = require('./auth/auth.schema');
const resolvers = require('./auth/auth.resolvers');
const userModel = require('./auth/auth.model');

module.exports = {
  resolvers,
  typeDefs,
  userModel
};
 