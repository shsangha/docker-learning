//resuable search suggestion component takes in a gql query and returns search results
import React, { Component } from 'react';
import ManualQueryWrapper from '../ManualQueryWrapper';

const tempSuggestions = ['Gucci', 'Bape', 'Supreme'];

class SuggestionSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      searchTerm: '',
      suggestions: this.props.suggestions,
      targetedSelection: 0
    };
  }

  fetchSuggestions = () => {};

  performSearch = () => {};

  handleInputChange = e => {
    this.setState(
      {
        searchTerm: e.target.value
      },
      () => {
        this.setState({ suggestions: tempSuggestions });
      }
      //add lodash throttle here
    );
  };

  openSearch = () => {
    this.setState({
      open: true
    });
  };

  closeSearch = () => {
    this.setState({
      open: false
    });
  };

  handleArrowKeyNav = e => {
    const { suggestions, targetedSelection } = this.state;
    switch (e.keyCode) {
      case 13:
        this.setState({
          targetedSelection: 0,
          open: false,
          searchTerm: suggestions[targetedSelection]
        });
        break;

      case 38:
        if (targetedSelection === 0) return;
        this.setState(prevState => ({
          targetedSelection: prevState.targetedSelection - 1
        }));
        break;

      case 40:
        if (targetedSelection >= suggestions.length) return;
        this.setState(prevState => ({
          targetedSelection: prevState.targetedSelection + 1
        }));
        break;
    }
  };

  render() {
    const { openSearch, closeSearch, handleInputChange, handleArrowKeyNav } = this;
    const { children } = this.props;
    const { open, suggestions, searchTerm, targetedSelection } = this.state;
    return children({
      openSearch,
      closeSearch,
      handleInputChange,
      handleArrowKeyNav,
      open,
      suggestions,
      searchTerm,
      targetedSelection
    });
  }
}

export default ManualQueryWrapper(SuggestionSearch);
