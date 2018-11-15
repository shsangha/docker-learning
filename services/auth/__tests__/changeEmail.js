const mongoose = require('mongoose');
const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const User = require('../src/api/auth/auth.model');
const createServer = require('../test-helpers/createServer');

const changeEmailMutation = gql`
  mutation change($input: String!) {
    changeEmail(email: $input) {
      ... on error {
        emailErrors
      }
      ... on success {
        token
      }
    }
  }
`;

const validEmail = 'shawn@emailchangetest.com';
const validPassword = '5%%fds9pf8sdf3';

jest.mock('../src/api/auth/auth.helpers/createTokens', () => user => {
  return { token: 'token', refreshToken: 'refreshToken' };
});
describe('testing change email functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.remove({ email: validEmail });
  });

  test('catches if we try to change to an invalid email', async () => {
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
      mutation: changeEmailMutation,
      variables: { input: 'invalidemail' }
    });
    expect(data.changeEmail.emailErrors).toContain('Enter a valid email');
  });
  test('return no errors on a valid email change', async () => {
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
      mutation: changeEmailMutation,
      variables: { input: 'shawn@changetest.net' }
    });

    expect(data.changeEmail.token).toEqual('token');
  });
});
