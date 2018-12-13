const jwt = require('jsonwebtoken');
const User = require('../auth.model');
const createTokens = require('./createTokens');

const { SECRET, REF_SECRET } = process.env;

module.exports = async refreshToken => {
  let userId;
  //  console.log(jwt.decode(refreshToken));
  try {
    const {
      user: { id }
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (e) {
    console.log(e);
    return {};
  }
  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);

  if (!user) {
    console.log('no user');
    return {};
  }
  const refreshSecret = user.password + REF_SECRET;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    console.log(err);
    return {};
  }

  try {
    const { token, refreshToken } = createTokens(user);
    return {
      token,
      refreshToken,
      user: user._id
    };
  } catch (error) {
    console.log(error);
    return {};
  }
};
