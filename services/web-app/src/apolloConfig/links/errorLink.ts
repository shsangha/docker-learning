// tslint:disable: no-console
import { onError } from "apollo-link-error";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      return null;
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError} AND CATCHING`);
  }
});

export default errorLink;
