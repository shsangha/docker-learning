/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
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
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
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
      email: 'doesntexist@aol.com',
      password: 'd8d8dlas6%%'
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(errors[0].message).toEqual('Validation Error');
    expect(errors[0].extensions.exception.data.messages.email).toEqual(
      'No user with this email found'
    );
    expect(data).toBeNull();
  });
  test('catches incorrect password', async () => {
    const variables = {
      email: validEmail,
      password: 'invalidPassword'
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(errors[0].message).toEqual('Validation Error');
    expect(errors[0].extensions.exception.data.messages.password).toEqual('Invalid password');
    expect(data).toBeNull();
  });
  test('displays the correct error when the db connection isnt working', async () => {
    const server = createServer({
      models: {
        User: 'not an acutal mongoose object so this will break'
      }
    });
    const { mutate } = createTestClient(server);
    const variables = {
      email: validEmail,
      password: validPassword
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(errors[0].message).toEqual('Mongo Error');
    expect(data).toBeNull();
  });
  test('return auth tokens when valid signin is detected', async () => {
    const variables = {
      email: validEmail,
      password: validPassword
    };
    const { data, errors } = await mutate({
      mutation: loginInMutation,
      variables
    });
    expect(data.login.token).toEqual('token');
    expect(data.login.refreshToken).toEqual('refreshToken');
    expect(errors).toBeUndefined();
  });
});
