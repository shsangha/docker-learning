const bcrypt = require('bcryptjs');
const createTokens = require('./auth.helpers/createTokens');
const { AuthenticationError } = require('apollo-server');
const signUp = require('./resolvers/signUp');
const login = require('./resolvers/login');
const deleteAccount = require('./resolvers/deleteAccount');
const changePassword = require('./resolvers/changePassword');
const changeEmail = require('./resolvers/changeEmail');

const authedUser = (_, args, ctx, info) => {
  return 'not broken';
};

const handleError = () => {
  throw new AuthenticationError('must authenticate');
};

module.exports = {
  Query: {
    authedUser,
    handleError
  },
  Mutation: {
    login,
    signUp,
    deleteAccount,
    changePassword,
    changeEmail,
    fake() {
      console.log('RUNNING THE QUERY');
      return true;
    }
  }
};
