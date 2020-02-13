const createTokens = require('../auth.helpers/createTokens');
const { ValidationError, MongoError, UnknownError } = require('../customErrors');
const groupValidationErrors = require('../auth.helpers/groupValidationErrors');
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
      throw new ValidationError({
        data: {
          messages: {
            email: 'Email is already in use'
          }
        }
      });
    }

    if (e.name === 'ValidationError') {
      const messages = groupValidationErrors(e.errors);

      throw new ValidationError({
        data: {
          messages
        }
      });
    }
    if (e.name === 'MongoError') {
      throw new MongoError();
    }
    throw new UnknownError();
  }
};

module.exports = signUp;
