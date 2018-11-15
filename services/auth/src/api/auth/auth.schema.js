const { gql } = require('apollo-server-express');

module.exports = gql`
  input AuthInput {
    email: String!
    password: String!
  }

  type success {
    token: String!
    refreshToken: String!
  }

  type error {
    emailErrors: [String]
    passwordErrors: [String]
  }

  union AuthResponse = error | success

  type Mutation {
    login(input: AuthInput!): AuthResponse!
    signUp(input: AuthInput!): AuthResponse!
    deleteAccount: Boolean!
    changePassword(password: String!): AuthResponse!
    changeEmail(email: String!): AuthResponse!
  }

  type Query {
    authedUser: String!
  }
`;
