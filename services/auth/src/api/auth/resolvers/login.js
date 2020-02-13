const bcrypt = require('bcryptjs');
const createTokens = require('../auth.helpers/createTokens');
const { ValidationError, MongoError } = require('../customErrors');

const login = async (_, { email, password }, { models }, info) => {
  try {
    const user = await models.User.findOne({ email });
    if (!user) {
      return new ValidationError({
        data: {
          messages: {
            email: 'No user with this email found'
          }
        }
      });
    }
    const validPw = await bcrypt.compare(password, user.password);
    if (!validPw) {
      return new ValidationError({
        data: {
          messages: {
            password: 'Invalid password'
          }
        }
      });
    }
    return { ...createTokens(user) };
  } catch (e) {
    throw new MongoError();
  }
};

module.exports = login;
