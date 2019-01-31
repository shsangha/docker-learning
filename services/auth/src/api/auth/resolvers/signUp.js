const createTokens = require('../auth.helpers/createTokens');
const ValidationError = require('../customErrors/ValidationError');

// will always return the tokens or throw an error so consistent return is covered
// eslint-disable-next-line consistent-return
const signUp = async (_, { email, password }, { models }, info) => {
  try {
    const user = await models.User.create({ email, password });
    const tokens = { ...createTokens(user) };
    return tokens;
    // NEED TO COME BACK HERE FOR KAFKA INTEGRATIONS
  } catch (e) {
    if (e.code === 11000) {
      throw new Error('Email is already in use');
    }

    if (e.name === 'ValidationError') {
      const messages = Object.keys(e.errors).reduce((messageObj, currentErr) => {
        // the side-effect is contained within the reduce function so this is fine
        // eslint-disable-next-line no-param-reassign
        messageObj[currentErr] = e.errors[currentErr].message;
        return messageObj;
      }, {});
      throw new ValidationError({
        data: {
          messages
        }
      });
    }
    if (e.name === 'MongoError') {
      throw new Error('Error connecting to the database');
    }
    throw new Error('Unknown Error');
  }
};

module.exports = signUp;
