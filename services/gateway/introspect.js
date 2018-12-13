const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools');
const { HttpLink } = require('apollo-link-http');
const { setContext } = require('apollo-link-context');
const fetch = require('node-fetch');

module.exports = {
  getIntrospectedSchema: async uri => {
    const http = new HttpLink({
      uri,
      fetch
    });

    const link = setContext((req, pCtx) => {
      if (pCtx.graphqlContext && pCtx.graphqlContext.hasOwnProperty('user')) {
        return {
          headers: {
            'x-user': pCtx.graphqlContext.user._id
          }
        };
      }
    }).concat(http);
    const schema = await introspectSchema(link);

    return makeRemoteExecutableSchema({
      schema,
      link
    });
  }
};
