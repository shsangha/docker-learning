import React from "react";
import { Query } from "react-apollo";
import checkScreenSize from "./checkScreenSize.gql";

interface Props
  extends Readonly<{
    [key: string]: any;
    [key: number]: any;
  }> {}

interface Data {
  windowWidth: number;
}

class AuthQuery extends Query<Data> {}

const ScreenWidthHOC = (Component: React.ElementType) => (props: Props) => (
  <AuthQuery query={checkScreenSize}>
    {({ data }) =>
      data &&
      typeof data.windowWidth === "number" && (
        <Component {...props} windowWidth={data.windowWidth} />
      )
    }
  </AuthQuery>
);

export default ScreenWidthHOC;
