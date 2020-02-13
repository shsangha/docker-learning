import React, { Component } from 'react';
import SuggestionSearch from '../SuggestionSearch';

export default class Suggestionusage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  onInputValueChange(inputValue) {
    this.setState(inputValue);
  }

  render() {
    return (
      <SuggestionSearch onInputValueChange>
        {getInputProps => {
          return <input {...getInputProps()} type="text" />;
        }}
      </SuggestionSearch>
    );
  }
}
