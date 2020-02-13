const { MongoError } = require('../customErrors');

const deleteAccount = async (_, args, { models, user }, info) => {
  try {
    await models.User.findByIdAndRemove(user.id);
    return true;
  } catch (error) {
    throw new MongoError();
  }
};

module.exports = deleteAccount;
