const jwt = require('jsonwebtoken');
const User = require('./auth.model');

const { SECRET, REF_SECRET } = process.env;

const createTokens = user => {
  const { _id, email, password } = user;
  const refreshSecret = password + REF_SECRET;
  const createToken = jwt.sign(
    {
      user: { id: _id, email }
    },
    SECRET,
    {
      expiresIn: '1000'
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: { id: _id }
    },
    refreshSecret,
    {
      expiresIn: '14d'
    }
  );

  return {
    token: createToken,
    refreshToken: createRefreshToken
  };
};

const refreshTokens = async refreshToken => {
  let userId;
  //  console.log(jwt.decode(refreshToken));
  try {
    const {
      user: { id }
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (e) {
    return {};
  }
  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);

  if (!user) {
    return {};
  }
  const refreshSecret = user.password + REF_SECRET;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  try {
    const { token, refreshToken } = createTokens(user);
    return {
      token,
      refreshToken,
      user
    };
  } catch (error) {
    return {};
  }
};

module.exports = {
  createTokens,
  refreshTokens
};
