import React, { Component } from 'react';
import styles from './style.module.scss';
import SuggestionSearch from '../../SuggestionSearch';
import { SearchContextConsumer } from '../SearchContext';

const query = {};

const defaultSuggestions = ['Gucci', 'Lousic'];

const Label = ({ openSearch }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  // eslint-disable-next-line jsx-a11y/label-has-for
  <label htmlFor="header_search">
    <svg className={styles.searchBar__icon}>
      <use xlinkHref="../../../../public/sprite.svg#icon-search" />
    </svg>
  </label>
);

const CloseButton = ({ closeSearch }) => (
  <button type="submit" onClick={closeSearch} className={styles.searchBar__closeBtn}>
    X
  </button>
);

const SuggestionList = ({ suggestions, targetedSelection }) => (
  <ul className={styles.suggestionContainer}>
    {suggestions.map((suggestion, idx) => {
      let className = 'df';
      if (targetedSelection === idx) {
        className = `${styles.highlighted} ${styles.list}`;
      }
      return <li key={suggestion}>{suggestion}</li>;
    })}
  </ul>
);

export default props => (
  <SearchContextConsumer>
    {({ notifySearchClosed, notifySearchOpened }) => {
      return (
        <SuggestionSearch suggestions={defaultSuggestions} query={query}>
          {({
            openSearch,
            closeSearch,
            open,
            searchTerm,
            handleInputChange,
            suggestions,
            handleArrowKeyNav,
            targetedSelection
          }) => {
            const searchBoxClassName = open
              ? `${styles.searchBar__searchBox} ${styles.searchBar__open}`
              : `${styles.searchBar__searchBox}`;

            const handleBlur = () => {
              notifySearchClosed();
              closeSearch();
            };

            const handleFocus = () => {
              notifySearchOpened();
              openSearch();
            };

            return (
              <div className={styles.searchBar}>
                {open ? (
                  <CloseButton closeSearch={closeSearch} />
                ) : (
                  <Label openSearch={openSearch} />
                )}

                <div className={searchBoxClassName}>
                  <input
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={styles.searchBar__input}
                    id="header_search"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleArrowKeyNav}
                  />
                  <button type="submit" className={styles.searchBar__searchBtn}>
                    Search
                  </button>
                </div>
                {open ? (
                  <SuggestionList suggestions={suggestions} targetedSelection={targetedSelection} />
                ) : null}
              </div>
            );
          }}
        </SuggestionSearch>
      );
    }}
  </SearchContextConsumer>
);
