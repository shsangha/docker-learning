import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import App from "./components/App";
import client from "./apolloConfig";

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("react-root")
);
