import { withClientState } from 'apollo-link-state';
import cache from './cache';

const stateLink = withClientState({
  cache
});

export default stateLink;
