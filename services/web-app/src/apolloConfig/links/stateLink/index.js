import { withClientState } from 'apollo-link-state';
import { merge } from 'lodash';
import cache from '../../cache';
import windowWidth from './window';
import authStatus from './authStatus';

const stateLink = withClientState({
  cache,
  ...merge(windowWidth, authStatus)
});

export default stateLink;
