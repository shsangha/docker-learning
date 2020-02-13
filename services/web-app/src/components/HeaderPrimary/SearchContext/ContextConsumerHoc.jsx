import React from 'react';
import { SearchContextConsumer } from './index';

export default Component => props => (
  <SearchContextConsumer>{values => <Component {...values} {...props} />}</SearchContextConsumer>
);
