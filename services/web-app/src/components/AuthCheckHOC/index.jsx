import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CHECK_AUTH_STATUS = gql`
  {
    authStatus @client
  }
`;

export default Component => props => (
  <Query query={CHECK_AUTH_STATUS}>
    {({ data: { authStatus } }) => <Component {...props} authStatus={authStatus} />}
  </Query>
);
