const login = (_, args, ctx, info) => {
  return 'running the login mutation';
};
const signUp = (_, args, ctx, info) => {
  return 'running the signup mutation';
};
const authedUser = (_, args, ctx, info) => {
  return 'running the auth query';
};


module.exports = {
  Query: {
    authedUser,
  },
  Mutation: {
    login,
    signUp,
  },
};
