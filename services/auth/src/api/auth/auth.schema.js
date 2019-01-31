const { gql } = require('apollo-server-express');

module.exports = gql`
  type AuthResponse {
    token: String!
    refreshToken: String!
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    signUp(email: String!, password: String!): AuthResponse!
    deleteAccount: Boolean!
    changePassword(password: String!): AuthResponse!
    changeEmail(email: String!): AuthResponse!
  }

  type Query {
    authedUser: String!
    handleError: String
  }
`;
