const jwt = require('jsonwebtoken');
const createTokens = require('../src/api/auth/auth.helpers/createTokens');

describe('signs and creates tokens properly', () => {
  const testUser = {
    _id: 'testId',
    email: 'test@email.com',
    password: 'secretpassword'
  };

  test.only('verify decoded tokens were what they should be', () => {
    const { token, refreshToken } = createTokens(testUser);

    const decodedToken = jwt.decode(token);
    expect(decodedToken.user.id).toEqual('testId');
    expect(decodedToken.user.email).toEqual('test@email.com');
    const decodedRefToken = jwt.decode(refreshToken);
    expect(decodedRefToken.user.id).toEqual('testId');
  });
});
