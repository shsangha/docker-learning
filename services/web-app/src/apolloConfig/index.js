import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';

import httpLink from './links/httpLink';
import stateLink from './links/stateLink';
import errorLink from './links/errorLink';
import middlewareLink from './links/middlewareLink';
import afterwareLink from './links/afterwareLink';
import cache from './cache';

const link = from([afterwareLink, middlewareLink, errorLink, stateLink, httpLink]);

const client = new ApolloClient({
  link,
  cache
});

export default client;
