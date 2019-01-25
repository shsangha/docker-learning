import React from 'react';
import { withApollo } from 'react-apollo';
import { of } from 'rxjs';
import { switchMap, map, catchError, retry } from 'rxjs/operators';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import styles from './style.module.scss';
import SuggestionSearch from '../../SuggestionSearch';
import Label from './Label';
import CloseButton from './CloseButton';

const suggestionQuery = gql`
  query getSuggestions($input: String!, $size: Int!, $sold: Boolean!) {
    getSuggestions(input: $input, size: $size, sold: $sold)
  }
`;

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five'];

const SearchBar = ({ client }) => {
  const renderMenuController = (open, closeMenu) => {
    return open ? <CloseButton closeMenu={closeMenu} /> : <Label />;
  };
  const renderSubmitButton = inputValue => {
    if (inputValue.length > 2) {
      return (
        <button type="submit" className={styles.searchBar__searchBtn}>
          Search
        </button>
      );
    }
    return null;
  };

  const renderSuggestions = (menuRef, getListItemProps, highlightedIndex, suggestions) => (
    <div className={styles.suggestionContainer} ref={menuRef}>
      {suggestions.map((suggestion, index) => {
        const listItem =
          index === highlightedIndex ? <li>{suggestion}}</li> : <li>{suggestion}</li>;
        return listItem;
      })}
    </div>
  );

  const streamTransform = $input => {
    const { query } = client;
    return $input.pipe(
      switchMap(input =>
        query({
          query: suggestionQuery,
          variables: {
            input,
            size: 5,
            sold: false
          }
        })
      ),
      retry(3),
      map(res => ({
        suggestions: res.data.getSuggestions,
        errors: []
      })),
      catchError(() =>
        of({
          suggestions: [],
          errrors: ['Unable to gather suggestions']
        })
      )
    );
  };

  return (
    <SuggestionSearch streamTransform={streamTransform} defaultSuggestions={defaultSuggestions}>
      {({
        open,
        inputValue,
        highlightedIndex,
        getInputProps,
        getListItemProps,
        closeMenu,
        menuRef,
        suggestions
      }) => {
        const inputBoxClassName = open
          ? `${styles.searchBar__inputContainer} ${styles.open}`
          : styles.searchBar__inputContainer;
        return (
          <div className={styles.searchBar}>
            <div className={styles.searchBar__searchBox}>
              {renderMenuController(open, closeMenu)}
              <div className={inputBoxClassName}>
                <input
                  name="header_search"
                  id="header_search"
                  type="text"
                  className={styles.searchBar__input}
                  {...getInputProps()}
                />
                {renderSubmitButton(inputValue)}
              </div>
            </div>
            {open
              ? renderSuggestions(menuRef, getListItemProps, highlightedIndex, suggestions)
              : null}
          </div>
        );
      }}
    </SuggestionSearch>
  );
};

SearchBar.propTypes = {
  client: propTypes.shape({
    query: propTypes.func
  }).isRequired
};

export default withApollo(SearchBar);
