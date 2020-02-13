// implementation of the auth middleware with promises just to demostrate it can be done this way
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const { SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    jwt.verify(token, SECRET, (err, user) => {
      if (user) {
        req.user = user;
      }
      if (err) {
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
            if (Object.keys(data).length !== 0 && data.user && data.token && data.refreshToken) {
              res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
              res.set('x-token', data.token);
              res.set('x-refresh-token', data.refreshToken);
              req.user = data.user;
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    });
  }
  next();
};
