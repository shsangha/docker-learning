import React from 'react';
import { ApolloConsumer } from 'react-apollo';

export default PassedComponent => props => (
  <ApolloConsumer>{client => <PassedComponent {...props} client={client} />}</ApolloConsumer>
);
