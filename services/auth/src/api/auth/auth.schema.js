const { gql } = require('apollo-server-express');

module.exports = gql`

input LoginInput {
  email: String!
  password: String!
}

input SignUpInput {
  email: String!
  password: String!
}

type successAuthResponse {
  token: String!
  refreshToken: String!
}

type error {
  email: [String]
  password: [String]
}

union AuthResponse = error | successAuthResponse

type Mutation {
  login(input: LoginInput!): AuthResponse! 
  signUp(input:SignUpInput!): AuthResponse
}

type Query {
  authedUser: String!
}
`;
