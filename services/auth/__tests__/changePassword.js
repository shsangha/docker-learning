/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const User = require('../src/api/auth/auth.model');
const createServer = require('../test-helpers/createServer');

const changepwMutation = gql`
  mutation changpw($input: String!) {
    changePassword(password: $input) {
      token
      refreshToken
    }
  }
`;

const validEmail = 'shawn@pwchangetest.com';
const validPassword = '5%%fds9pf8sdf3';

jest.mock('../src/api/auth/auth.helpers/createTokens', () => user => ({
  token: 'token',
  refreshToken: 'refreshToken'
}));
describe('testing change pw functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.remove({ email: validEmail });
  });

  test('catches if we try to change to an invalid pw', async () => {
    const user = await User.create({
      email: validEmail,
      password: validPassword
    });

    const server = createServer({
      models: {
        User
      },
      user: { id: user._id, email: user.email }
    });

    const { mutate } = createTestClient(server);

    const { data, errors } = await mutate({
      mutation: changepwMutation,
      variables: { input: 'invalidpw' }
    });
    expect(data).toBeNull();
    expect(errors[0].extensions.exception.data.messages.password).toEqual('invalid password');
  });
  test('return new tokens on a valid password change', async () => {
    const user = await User.create({
      email: validEmail,
      password: validPassword
    });
    const server = createServer({
      models: {
        User
      },
      user: { id: user._id, email: user.email }
    });

    const { mutate } = createTestClient(server);

    const { data, errors } = await mutate({
      mutation: changepwMutation,
      variables: { input: '%hFh43*fdsdf' }
    });

    expect(data.changePassword.token).toEqual('token');
    expect(data.changePassword.refreshToken).toEqual('refreshToken');
  });
});
