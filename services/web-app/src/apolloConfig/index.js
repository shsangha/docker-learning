import { ApolloClient } from 'apollo-client';

import httpLink from './httpLink';
import cache from './cache';

const client = new ApolloClient({
  link: httpLink,
  cache
});

export default client;
