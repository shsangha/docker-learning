const createTokens = require('../auth.helpers/createTokens');
const groupValidationErrors = require('../auth.helpers/groupValidationErrors');
const { ValidationError, UnknownError, MongoError } = require('../customErrors');

const changeEmail = async (_, { email }, { models, user }, info) => {
  try {
    await models.User.findByIdAndUpdate(user.id, { email }, { runValidators: true });
    return { ...createTokens(user) };
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

module.exports = changeEmail;
