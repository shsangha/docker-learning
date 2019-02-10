/* eslint-disable no-undef */
import { setContext } from 'apollo-link-context';

// prettier-ignore
const middlewareLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        "x-token": localStorage.getItem('token') || null,
        "x-refreshToken": localStorage.getItem('refreshToken')|| null
      }
    }));

export default middlewareLink;
