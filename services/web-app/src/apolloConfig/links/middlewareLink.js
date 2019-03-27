/* eslint-disable no-undef */
import { setContext } from "apollo-link-context";

// prettier-ignore
const middlewareLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        "x-token": localStorage.getItem('token') || '',
        "x-refreshToken": localStorage.getItem('refreshToken')|| ''
      }
    }));

export default middlewareLink;
