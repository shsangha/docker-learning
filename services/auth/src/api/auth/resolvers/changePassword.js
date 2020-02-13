const createTokens = require('../auth.helpers/createTokens');
const groupValidationErrors = require('../auth.helpers/groupValidationErrors');
const { ValidationError, MongoError, UnknownError } = require('../customErrors');

const changePassword = async (_, { password }, { models, user }, info) => {
  try {
    await models.User.findByIdAndUpdate(user.id, { password }, { runValidators: true });
    return { ...createTokens(user) };
  } catch (e) {
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

module.exports = changePassword;
