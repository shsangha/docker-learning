/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/api/auth/auth.model');

const { REF_SECRET } = process.env;
const refreshTokens = require('../src/api/auth/auth.helpers/refreshTokens');

jest.mock('../src/api/auth/auth.helpers/createTokens', () => user => {
  return { token: 'token', refreshToken: 'refreshToken' };
});

describe('tests for refreshToken function', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.remove({});
  });

  test('return {} with invalid input', async () => {
    const email = 'shawn@gmail.com';
    const password = '6%%dfs32r';
    const refSecret = password + REF_SECRET;

    const user = await User.create({ email, password });

    const token = jwt.sign(
      {
        user: { notId: 'sdfds' }
      },
      refSecret,
      {
        expiresIn: '34334'
      }
    );

    const res = await refreshTokens(token);
    expect(res).toEqual({});
  });
  test('return {} with invalid id', async () => {
    const email = 'shawn@gmail.com';
    const password = '6%%dfs32r';
    const refSecret = password + REF_SECRET;

    const user = await User.create({ email, password });

    const token = jwt.sign(
      {
        user: { _id: 'sdfds' }
      },
      refSecret,
      {
        expiresIn: '34334'
      }
    );

    const res = await refreshTokens(token);
    expect(res).toEqual({});
  });
  test('return {} with wrong password', async () => {
    const email = 'shawn@gmail.com';
    const givenPassword = '6%%dfs32r';

    const user = await User.create({ email, password: givenPassword });
    const refSecret = givenPassword + REF_SECRET;
    const token = jwt.sign(
      {
        user: { id: user._id }
      },
      refSecret,
      {
        expiresIn: '14d'
      }
    );

    const res = await refreshTokens(token);
    expect(res).toEqual({});
  });
  test('return {} with invalid token', async () => {
    const email = 'shawn@gmail.com';
    const givenPassword = '6%%dfs32r';

    const user = await User.create({ email, password: givenPassword });
    const refSecret = givenPassword + REF_SECRET;
    const token = 'ds897fsdofdsaklfjalsdkf789wf7a98dasf';

    const res = await refreshTokens(token);
    expect(res).toEqual({});
  });

  test('return token with valid input', async () => {
    const email = 'shawn@gmail.com';
    const givenPassword = '6%%dfs32r';

    const user = await User.create({ email, password: givenPassword });
    const refSecret = user.password + REF_SECRET;
    const token = jwt.sign(
      {
        user: { id: user._id }
      },
      refSecret,
      {
        expiresIn: '14d'
      }
    );

    const res = await refreshTokens(token);
    expect(res).toMatchObject({
      token: 'token',
      refreshToken: 'refreshToken',
      user: user._id
    });
  });
});
