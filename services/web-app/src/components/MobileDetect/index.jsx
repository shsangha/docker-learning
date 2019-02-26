import { graphql } from 'react-apollo';
import React from 'react';
import gql from 'graphql-tag';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck } from 'rxjs/operators';

class MobileDetect extends React.Component {
  componentDidMount() {
    const { mutate } = this.props;
    this.resize$ = fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        pluck('currentTarget', 'innerWidth')
      )
      .subscribe(windowWidth =>
        mutate({
          variables: { windowWidth }
        })
      );
  }

  componentWillUnmount() {
    this.resize$.unsubscribe();
  }

  render() {
    return null;
  }
}

const RESIZE_WINDOW = gql`
  mutation ResizeWindow($windowWidth: Int!) {
    handleWindowResize(windowWidth: $windowWidth) @client {
      windowWidth @client
    }
  }
`;

export default graphql(RESIZE_WINDOW)(MobileDetect);
