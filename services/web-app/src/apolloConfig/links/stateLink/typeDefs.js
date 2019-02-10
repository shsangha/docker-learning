import gql from 'graphql-tag';

const query = gql`
  query GetTodos {
    searchTerm @client {
      dynamic
    }
  }
`;
export const resolvers = {
  Mutation: {
    setTopLevel: (_, args, { cache }) => {
      const data = {
        searchTerm: {
          top: args.input,
          dynamic: '',
          __typename: 'SearchTerm'
        }
      };
      cache.writeData({ data });
      return null;
    }
  }
};

export const defaults = {
  searchTerm: {
    __typename: 'SearchTerm',
    top: 'SPiDO',
    dynamic: ''
  }
};
