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

const signInMutation = gql`
  mutation signin($input: AuthInput!) {
    signUp(input: $input) {
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
describe('testing sigin functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.remove({});
  });

  test('it returns tokens if a valid user signs up', async () => {
    const input = {
      input: {
        email: 'shawn@kjdaf.ca',
        password: '3G55sf%ssf'
      }
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(data.signUp.token).toEqual('token');
    expect(data.signUp.refreshToken).toEqual('refreshToken');
  });

  test('shows the correct errors when given empty input', async () => {
    const input = {
      input: {
        email: '',
        password: ''
      }
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(data.signUp.emailErrors).toContain('Email is required');
    expect(data.signUp.passwordErrors).toContain('Password is required');
  });
  test('graphql validation stops query from running without required input', async () => {
    const input = {
      input: {}
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(errors).toHaveLength(2);
    expect(data).toBe(undefined);
  });
  test('doesnt allow for an invalid email', async () => {
    const input = {
      input: {
        email: 'shawn,@.ca',
        password: '8H6$hdsfd2'
      }
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(data.signUp.emailErrors).toContain('Enter a valid email');
  });
  test('doesnt allow for an invalid password', async () => {
    const input = {
      input: {
        email: 'shawn@.ca',
        password: '8H62'
      }
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(data.signUp.passwordErrors).toContain('invalid password');
  });
  test('detects when email is in use', async () => {
    const existingUser = {
      email: 'shawn@gmail.com',
      password: '34%ssad93'
    };

    await User.create(existingUser);

    const input = {
      input: {
        email: 'shawn@gmail.com',
        password: '8H676%$$2'
      }
    };
    const { mutate } = createTestClient(server);
    const { data, errors } = await mutate({ mutation: signInMutation, variables: input });
    expect(data.signUp.emailErrors).toContain('Email already in use');
  });
});
