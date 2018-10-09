const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

module.exports = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (error) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await fetch('AUTHURL/refresh', { method: 'POST', body: { token, refreshToken } });
      if (newTokens && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Heasers', 'x-token', 'x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};
