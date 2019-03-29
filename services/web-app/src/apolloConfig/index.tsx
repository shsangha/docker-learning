import { ApolloClient } from "apollo-client";

import link from "./links";
import cache from "./cache";

// initial cache state
cache.writeData({
  data: { windowWidth: window.innerWidth, authenticated: false }
});

const client = new ApolloClient({
  link,
  cache
});

export default client;
