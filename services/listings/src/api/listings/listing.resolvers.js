const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const getSuggestions = require('./resolvers/query/getSuggestions');
const seeIndex = require('./resolvers/query/seeIndex');

module.exports = {
  Query: {
    getSuggestions,
    seeIndex
  },
  Mutation: {
    test: (a, v, b, d) => {
      return 'dsdf';
    }
  },
  Listing: {
    __resolveType(listing, context, info) {
      if (listing.buyNowOptions) {
        return 'BuyNow';
      }
      return 'NoBuyNow';
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    }
  })
};
