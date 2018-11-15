const mongoose = require('mongoose');
const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const User = require('../src/api/auth/auth.model');
const createServer = require('../test-helpers/createServer');

const deleteMutation = gql`
  mutation deleteAccount {
    deleteAccount
  }
`;

const validEmail = 'shawn@deletetest.com';
const validPassword = '5%%fds9pf8sdf3';

describe('testing deletion functionality', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await User.remove({ email: validEmail });
    await mongoose.connection.close();
  });

  test.only('deletes account', async () => {
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
      mutation: deleteMutation
    });
    expect(data.deleteAccount).toBe(true);
    const deleted = await User.findOne({ email: validEmail });
    expect(deleted).toBe(null);
  });
});
