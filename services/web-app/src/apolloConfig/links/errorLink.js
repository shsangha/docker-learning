/* eslint-disable no-undef */
/* eslint-disable no-console */
import { onError } from 'apollo-link-error';
import gql from 'graphql-tag';

const query = gql`
  {
    authStatus @client
  }
`;
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const { response, cache } = operation.getContext();
  console.log(operation.getContext());
  const authentiated = cache.readQuery({ query });
  if (response.status === 401 && authentiated) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    const data = { authStatus: false };
    cache.writeData({ data });
  }

  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      return null;
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export default errorLink;
