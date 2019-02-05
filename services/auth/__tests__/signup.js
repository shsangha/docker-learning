/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
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

const signInMutation = gql`
  mutation signin($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`;

const validEmail = 'shawn@signuptest.com';
const validPassword = '%ff3aDD98fd';

describe('testing sigin functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await User.remove({ email: validEmail });
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.remove({ email: validEmail });
  });

  test('it returns tokens if a valid user signs up with valid credentials', async () => {
    const variables = {
      email: validEmail,
      password: '3G55sf%ssf'
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(data.signUp.token).toEqual('token');
    expect(data.signUp.refreshToken).toEqual('refreshToken');
  });

  test('shows the correct errors when given empty input', async () => {
    const variables = {
      email: '',
      password: ''
    };
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(errors[0].message).toEqual('Validation Error');
    expect(errors[0].extensions.exception.data.messages.email).toEqual('Email is required');
  });
  test('graphql validation for required types works', async () => {
    const variables = {};
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(errors).toHaveLength(2);
    expect(data).toBe(undefined);
  });
  test('doesnt allow for an invalid email', async () => {
    const variables = {
      email: 'shawn,@.ca',
      password: '8H6$hdsfd2'
    };
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(errors[0].extensions.exception.data.messages.email).toEqual('Enter a valid email');
    expect(data).toBe(null);
  });
  test('doesnt allow for an invalid password', async () => {
    const variables = {
      email: 'shawn@.ca',
      password: '8H62'
    };
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(errors[0].extensions.exception.data.messages.password).toEqual('invalid password');
    expect(data).toBeNull();
  });
  test('detects when email is in use', async () => {
    const existingUser = {
      email: validEmail,
      password: validPassword
    };

    await User.create(existingUser);

    const variables = {
      email: validEmail,
      password: validPassword
    };
    const { data, errors } = await mutate({ mutation: signInMutation, variables });
    expect(errors[0].extensions.exception.data.messages.email).toEqual('Email is already in use');
    expect(errors[0].message).toEqual('Validation Error');
  });
});
