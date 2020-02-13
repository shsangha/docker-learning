import { Query } from 'react-apollo';
import React from 'react';
import gql from 'graphql-tag';

export default () => (
  <Query
    query={gql`
      {
        authedUser
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.log(error);
        return <div>err</div>;
      }
      console.log(data);
      return <p>{data.authedUser}</p>;
    }}
  </Query>
);
