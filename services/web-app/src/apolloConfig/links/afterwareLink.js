/* eslint-disable no-undef */
import { ApolloLink } from 'apollo-link';

const afterwareLink = new ApolloLink((operation, forward) => {
  console.log(operation.getContext());

  return forward(operation).map(response => {
    const { headers } = operation.getContext();

    if (headers) {
      const token = headers['x-token'];
      const refreshToken = headers['x-refreshToken'];

      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response;
  });
});

export default afterwareLink;
