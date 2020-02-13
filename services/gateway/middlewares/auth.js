const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const { SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      try {
        const authResponse = await fetch('http://auth-service:3030/refreshtokens', {
          method: 'POST',
          body: JSON.stringify({
            refreshToken
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await authResponse.json();
        if (Object.keys(data).length !== 0 && data.token && data.refreshToken && data.user) {
          res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
          res.set('x-token', data.token);
          res.set('x-refresh-token', data.refreshToken);
          req.user = data.user;
        } else {
          res.status(401);
        }
      } catch (error) {
        res.status(401);
      }
    }
  }
  next();
};
