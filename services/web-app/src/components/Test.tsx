import React, { Component } from "react";
import { fromEvent, Observable, Subscription } from "rxjs";
import { switchMap, pluck, tap, catchError } from "rxjs/operators";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

class Test extends Component<{ client: any }> {
  public inputRef: any = React.createRef();

  public componentDidMount() {
    const input$ = fromEvent(this.inputRef.current, "input")
      .pipe(
        pluck("target", "value"),
        switchMap(input => {
          return this.props.client.query({
            query: gql`
              query {
                authedUser
              }
            `
          });
        })
      )
      .subscribe({
        next(x: any) {
          console.log(x);
        },
        error(x: any) {
          console.log(x, "hit the error");
        }
      });
  }

  public render() {
    return <input type="text" ref={this.inputRef} />;
  }
}

export default withApollo<any, any>(Test);
