const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { SECRET, REF_SECRET } = process.env;

const createTokens = async (user) => {
  const { id, username, password } = user;
  const refreshSecret = password + REF_SECRET;
  const createToken = jwt.sign(
    {
      user: { id, username },
    },
    SECRET,
    {
      expiresIn: '1hr',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: { id },
    },
    refreshSecret,
    {
      expiresIn: '14d',
    },
  );

  return [createToken, createRefreshToken];
};

const refreshTokens = async (token, refreshToken, models) => {
  let userId;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (e) {
    return {};
  }
  if (!userId) {
    return {};
  }

  const user = await models.User.findById(userId);

  if (!user) {
    return {};
  }
  const refreshSecret = user.password + REF_SECRET;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }
  const [newToken, newRefreshToken] = await createTokens(user, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
  };
};

const attemptLogin = async (email, password, models) => {
  const user = await models.User.findOne({ email });
  if (!user) {
    return {
      error: 'no user found',
    };
  }
  const validPw = await bcrypt.compare(password, user.password);
  if (!validPw) {
    return {
      error: 'invalid password',
    };
  }

  const [token, refreshToken] = await createTokens(user);

  return {
    token,
    refreshToken,
  };
};

module.exports = {
  createTokens,
  refreshTokens,
  attemptLogin,
};
