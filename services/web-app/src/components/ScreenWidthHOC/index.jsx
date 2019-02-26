import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CHECK_SCREENSIZE = gql`
  {
    windowWidth @client
  }
`;

export default Component => props => (
  <Query query={CHECK_SCREENSIZE}>
    {({ data: { windowWidth } }) => <Component {...props} windowWidth={windowWidth} />}
  </Query>
);
