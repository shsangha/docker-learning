const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

module.exports = {
  getIntrospectedSchema: async (uri) => {
    const createLink = () => createHttpLink({
      uri,
      fetch,
    });
    const schema = await introspectSchema(createLink());

    return makeRemoteExecutableSchema({
      schema,
      link: createLink(),
    });
  },
};
