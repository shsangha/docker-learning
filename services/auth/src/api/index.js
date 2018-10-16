const auth = require('./auth');
//  NEED TO ADD LOADERS
module.exports = {
  typeDefs: auth.typeDefs,
  resolvers: auth.resolvers,
  context: {
    models: {
      auth: auth.model,
    },
  },
};
