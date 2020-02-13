const typeDefs = require('./listings/listing.typeDefs');
const resolvers = require('./listings/listing.resolvers');
const esClient = require('./listings/esClient');

module.exports = {
  typeDefs,
  resolvers,
  esClient
};
