const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const { SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    console.log('running the inside');
    try {
      const { user } = await jwt.verify(token, SECRET);
      req.user = user;
      next();
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      try {
        const data = await fetch('http://auth-service:3030/refreshtokens', {
          method: 'POST',
          body: JSON.stringify({
            refreshToken
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const re = await data.json();
        if (Object.keys(re).length !== 0) {
          res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
          res.set('x-token', data.token);
          res.set('x-refresh-token', data.refreshToken);
          req.user = re.user;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  next();
};
