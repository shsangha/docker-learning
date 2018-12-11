import React, { Component } from 'react';

const SearchContext = React.createContext();

export class SearchContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  searchClosed = () => {
    this.setState({
      open: false
    });
  };

  searchOpen = () => {
    this.setState({
      open: true
    });
  };

  render() {
    return (
      <SearchContext.Provider
        value={{
          state: this.state,
          notifySearchClosed: this.searchClosed,
          notifySearchOpened: this.searchOpen
        }}
      >
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}

export const SearchContextConsumer = SearchContext.Consumer;
