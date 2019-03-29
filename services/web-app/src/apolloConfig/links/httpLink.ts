import { HttpLink } from "apollo-link-http";

const httpLink: HttpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

export default httpLink;
