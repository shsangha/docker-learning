const jwt = require('jsonwebtoken');
const User = require('../auth.model');

const { SECRET, REF_SECRET } = process.env;
module.exports = user => {
  const { _id, email, password } = user;
  const refreshSecret = password + REF_SECRET;
  const createToken = jwt.sign(
    {
      user: { id: _id, email }
    },
    SECRET,
    {
      expiresIn: '3m'
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
