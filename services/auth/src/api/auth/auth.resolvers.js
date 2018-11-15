const bcrypt = require('bcryptjs');
const createTokens = require('./auth.helpers/createTokens');

const login = async (_, { input: { email, password } }, { models }, info) => {
  try {
    const user = await models.User.findOne({ email });
    if (!user) {
      return { emailErrors: ['No user with this email exists'] };
    }
    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw) {
      return { passwordErrors: ['Incorrect password'] };
    }
    return { ...createTokens(user) };
  } catch (e) {
    return { emailErrors: ['Issue connecting to authentication service try again'] };
  }
};

const signUp = async (_, { input: { email, password } }, { models }, info) => {
  try {
    const user = await models.User.create({ email, password });
    const tokens = { ...createTokens(user) };
    return tokens;
    // NEED TO COME BACK HERE FOR KAFKA INTEGRATIONS
  } catch (e) {
    if (e.code === 11000) {
      return {
        emailErrors: ['Email already in use']
      };
    }

    const errObj = Object.keys(e.errors).reduce((accumulator, key) => {
      accumulator[`${key}Errors`] = [e.errors[key].message];
      return accumulator;
    }, {});
    return errObj;
  }
};

const deleteAccount = async (_, args, { models, user }, info) => {
  try {
    await models.User.findByIdAndRemove(user.id);
    return true;
  } catch (error) {
    return false;
  }
};

const authedUser = (_, args, ctx, info) => {
  return 'DONT BREAK';
};

const changePassword = async (_, { password }, { models, user }, info) => {
  try {
    await models.User.findByIdAndUpdate(user.id, { password }, { runValidators: true });
    return { ...createTokens(user) };
  } catch (e) {
    const errObj = Object.keys(e.errors).reduce((accumulator, key) => {
      accumulator[`${key}Errors`] = [e.errors[key].message];
      return accumulator;
    }, {});
    return errObj;
  }
};

//look into changing this changing emails doesnt rly need new tokens
const changeEmail = async (_, { email }, { models, user }, info) => {
  console.log(email);
  try {
    await models.User.findByIdAndUpdate(user.id, { email }, { runValidators: true });
    return { ...createTokens(user) };
  } catch (e) {
    const errObj = Object.keys(e.errors).reduce((accumulator, key) => {
      accumulator[`${key}Errors`] = [e.errors[key].message];
      return accumulator;
    }, {});
    console.log(errObj);
    return errObj;
  }
};
/*
const changeField = async (field, model, user) => {
  try {
    await models.User.findByIdAndUpdate(user.id, { field }, { runValidators: true });
    return;
  } catch (e) {
    const errObj = Object.keys(e.errors).reduce((accumulator, key) => {
      accumulator[`${key}Errors`] = [e.errors[key].message];
      return accumulator;
    }, {});
    console.log(errObj);
    return errObj;
  }
};
*/
module.exports = {
  AuthResponse: {
    __resolveType(data, ctx, info) {
      if (!data.token) {
        return 'error';
      }
      return 'success';
    }
  },

  Query: {
    authedUser
  },
  Mutation: {
    login,
    signUp,
    deleteAccount,
    changePassword,
    changeEmail
  }
};
