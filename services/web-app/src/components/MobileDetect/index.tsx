import { ApolloConsumer } from "react-apollo";
import React, { Component } from "react";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime, pluck } from "rxjs/operators";
import ApolloClient from "apollo-client";

interface Props {
  client: ApolloClient<any>;
}

class MobileDetect extends Component<Props> {
  private resize$: Subscription | undefined;

  public componentDidMount() {
    const { client } = this.props;

    this.resize$ = fromEvent(window, "resize")
      .pipe(
        debounceTime(300),
        pluck("currentTarget", "innerWidth")
      )
      .subscribe(windowWidth => {
        client.writeData({ data: { windowWidth } });
      });
  }

  public componentWillUnmount() {
    if (this.resize$) {
      this.resize$.unsubscribe();
    }
  }

  public render() {
    return null;
  }
}

export default () => (
  <ApolloConsumer>{client => <MobileDetect client={client} />}</ApolloConsumer>
);
