const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const { SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
      next();
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      fetch('http://auth-service:3030/refreshtokens', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
        .then(data => {
          res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
          res.set('x-token', data.token);
          res.set('x-refresh-token', data.refreshToken);
          req.user = data.user;
        })
        .then(data => next())
        .catch(e => next());
    }
  }
};
