const { refreshTokens } = require('./api/auth/auth.helpers');
const express = require('express');
const router = express.Router();

router.post('/refreshtokens', async (req, res) => {
  const { token, refreshToken } = req.body;
  const newTokens = await refreshTokens(refreshToken);
  res.json(newTokens);
});

module.exports = router;
