const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const testQuery = async (_, args, ctx, info) => {
  return 'QUERY';
};

const testMutation = async (_, args, ctx, info) => {
  return 'MUTATION';
};

module.exports = {
  BaseListing: {
    __resolveType(listing, ctx, info) {
      if (listing.shipping) {
        return 'BuyNowListing';
      }
      return 'Listing';
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'allows passing dates into gql',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
  }),
  Query: {
    testQuery
  },
  Mutation: {
    testMutation
  }
};
