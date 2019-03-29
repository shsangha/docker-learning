import { from } from "apollo-link";
import httpLink from "./httpLink";
import afterwareLink from "./afterWareLink";
import middlewareLink from "./middlewareLink";
import errorLink from "./errorLink";

export default from([afterwareLink, middlewareLink, errorLink, httpLink]);
