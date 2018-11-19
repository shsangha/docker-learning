import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ApolloLink, from } from 'apollo-link';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const logErrLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// prettier-ignore
const middlewareLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-token": localStorage.getItem('token') || "",
      "x-refreshToken": localStorage.getItem('refreshToken')|| ""
    }
  }
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const {
      response: { headers }
    } = context;

    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response;
  });
});

const link = from([afterwareLink, middlewareLink, logErrLink, httpLink]);

export default link;
