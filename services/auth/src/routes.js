const express = require('express');
const refreshTokens = require('./api/auth/auth.helpers/refreshTokens');

const router = express.Router();

router.post('/refreshtokens', async (req, res) => {
  const { refreshToken } = req.body;
  const newTokens = await refreshTokens(refreshToken);
  res.json(newTokens);
});

router.post('/test', (req, res) => {
  res.send('test');
});

module.exports = router;
