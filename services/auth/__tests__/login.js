const mongoose = require('mongoose');
const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const User = require('../src/api/auth/auth.model');
const createServer = require('../test-helpers/createServer');

jest.mock('../src/api/auth/auth.helpers/createTokens', () => user => {
  return { token: 'token', refreshToken: 'refreshToken' };
});

const server = createServer({
  models: {
    User
  }
});

const { mutate } = createTestClient(server);

const loginInMutation = gql`
  mutation login($input: AuthInput!) {
    login(input: $input) {
      ... on error {
        emailErrors
        passwordErrors
      }
      ... on success {
        token
        refreshToken
      }
    }
  }
`;

const validEmail = 'shawn@logintest.com';
const validPassword = '5%%fds9pf8sdf3';

describe('testing login functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
    await User.create({
      email: validEmail,
      password: validPassword
    });
  });

  afterAll(async () => {
    await User.remove({ email: 'shawn@logintest.com' });

    await mongoose.connection.close();
  });

  test('errors out when email doesnt exist', async () => {
    const variables = {
      input: {
        email: 'doesntexist@aol.com',
        password: 'd8d8dlas6%%'
      }
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(data.login.emailErrors).toContain('No user with this email exists');
  });
  test('catches incorrect password', async () => {
    const variables = {
      input: {
        email: validEmail,
        password: 'invalidPassword'
      }
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(data.login.passwordErrors).toContain('Incorrect password');
  });
  test('displays the correct error when the db connection isnt working', async () => {
    const server = createServer({
      models: {
        User: 'not an acutal mongoose object so this will break'
      }
    });
    const { mutate } = createTestClient(server);
    const variables = {
      input: {
        email: validEmail,
        password: validPassword
      }
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(data.login.emailErrors).toContain(
      'Issue connecting to authentication service try again'
    );
  });
  test('return auth tokens when valid signin is detected', async () => {
    const variables = {
      input: {
        email: validEmail,
        password: validPassword
      }
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(data.login.token).toEqual('token');
    expect(data.login.refreshToken).toEqual('refreshToken');
  });
});
