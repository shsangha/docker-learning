const { gql } = require('apollo-server-express');

module.exports = gql`

input LoginInput {
  username: String!
  password: String!
}

input SignUpInput {
  username: String!
  email: String!
  password: String!
}

type Mutation {
  login(input: LoginInput!): String! 
  signUp(input:SignUpInput!): String!
}

type Query {
  authedUser: String!
}
`;
