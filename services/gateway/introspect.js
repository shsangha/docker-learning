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
      if (
        pCtx.graphqlContext &&
        pCtx.graphqlContext.hasOwnProperty('token') &&
        pCtx.graphqlContext.hasOwnProperty('refToken')
      ) {
        return {
          headers: {
            'x-token': pCtx.graphqlContext.token,
            'x-refresh-token': pCtx.graphqlContext.refToken
          }
        };
      }
      return {
        headers: {
          'x-token': null,
          'x-refresh-token': null
        }
      };
    }).concat(http);
    const schema = await introspectSchema(link);

    return makeRemoteExecutableSchema({
      schema,
      link
    });
  }
};
/*
const createLink = () =>
      createHttpLink({
        uri,
        fetch
      });
*/
