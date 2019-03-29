import * as React from "react";
import { Query } from "react-apollo";
import authStatusQuery from "./authStatusQuery.gql";

interface Props
  extends Readonly<{
    [propName: string]: any;
    [propName: number]: any;
  }> {}

interface Data {
  authenticated: boolean;
}

class AuthQuery extends Query<Data, {}> {}

export default (Component: React.ReactType) => (props: Props) => (
  <AuthQuery query={authStatusQuery}>
    {({ data }) =>
      data &&
      typeof data.authenticated !== "undefined" && (
        <Component {...props} authenticated={data.authenticated} />
      )
    }
  </AuthQuery>
);
