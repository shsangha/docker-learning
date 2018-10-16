const { UserInputError } = require('apollo-server');
const { createTokens, tryLogin } = require('./auth.helpers');

const login = (_, args, ctx, info) => '';
const signUp =  async (_, { input: { email, password } }, { models }, info) => {
  try {
    const user = await models.auth.create({ email, password });
    // create the token and return that here
  } catch (e) {
    if (e.code === 11000) {
      return {
        email: ['Email already in use'],
      };
    }
    const errObj = Object.keys(e.errors).reduce((accumulator, key) => {
      accumulator[`${key}`] = [e.errors[key].message];
      return accumulator;
    }, {});
    return errObj;
  }
}
const authedUser = (_, args, ctx, info) => 'running the auth query';


module.exports = {
  AuthResponse: {
    __resolveType(data, ctx, info) {
      console.log(data);
      if (!data.token) {
        return 'error';
      }
      return 'successAuthResponse';
    },
  },
  Query: {
    authedUser,
  },
  Mutation: {
    login,
    signUp,
  },
};
