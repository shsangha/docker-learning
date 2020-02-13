import React, { Component } from 'react';
import SuggestionSearch from './index';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { pipe } from 'rxjs';
import { pluck, map, switchMap, debounceTime } from 'rxjs/operators';
import styles from './usage.module.scss';
import changeTypes from './changeTypes';

const streamTransform = $inputStream => {
  return $inputStream.pipe(pluck('target', 'value'));
};

class Usage extends Component {
  state = {
    inputValue: '',
    exinputValue: '',
    a: ''
  };

  onChange = val => {
    //  console.log(val);
    this.setState(val);
  };

  stateReducer = (changes, currentState, changeType) => {
    // console.log(changes, 'changes');
    //console.log(currentState, 'currentState');
    /*
    if (changeType === changeTypes.keyArrow) {
      return {
        ...changes,
        inputValue: currentState.inputValue
      };
    }
*/
    return changes;
  };

  onInputChange = e => {
    this.setState({ exinputValue: e.target.value });
  };

  onSelect = d => {
    //  alert(d);
  };

  onHover = (e, index) => {
    console.log(index);
  };

  keyDownHanlder = e => {
    e.preventDefault();
    e.stopPropagation();

    console.log('keydown ');
  };

  streamTransform = $stream => {
    return $stream.pipe(
      debounceTime(300),
      switchMap(input => {
        return this.props.client.query({
          query: gql`
            {
              seeIndex
            }
          `
        });
      }),
      map(x => {
        this.setState({
          a: `${Math.random()}`
        });
        console.log('runnong throug');
        if (x.data) {
          return ['uno', 'dos', 'tres'];
        }
        return [];
      })
    );
  };

  testQuery = e => {
    const a = this.props.client
      .query({
        query: gql`
          {
            authedUser
          }
        `
      })
      .then(val => console.log(val));
  };

  onMouseDown = e => e.preventDefault();

  handleClick = e => {
    e.preventInternalEventHandlers = true;
    console.log('CALLED UP');
  };

  render() {
    return (
      <SuggestionSearch
        onSelect={this.onSelect}
        stateReducer={this.stateReducer}
        onParentStateChange={this.onChange}
        streamTransform={this.streamTransform}
      >
        {({
          getInputProps,
          suggestions,
          highlightedIndex,
          itemRef,
          onHover,
          menuRef,
          open,
          getListItemProps,
          openMenu,
          closeMenu
        }) => {
          return (
            <div className={styles.wrapper}>
              <input
                className={styles.input}
                {...getInputProps({ onChange: this.onInputChange })}
                type="text"
              />
              {open ? (
                <div ref={menuRef} className={styles.menu}>
                  {suggestions.map((suggestion, index) => {
                    const item =
                      index === highlightedIndex ? (
                        <li
                          {...getListItemProps({ index, onClick: this.handleClick })}
                          key={suggestion}
                          className={styles.item__selected}
                          ref={itemRef}
                        >
                          SELECTED
                        </li>
                      ) : (
                        <li
                          {...getListItemProps({ index })}
                          key={suggestion}
                          onClick={this.keyDownHanlder}
                          className={styles.item}
                        >
                          {suggestion}
                        </li>
                      );
                    return item;
                  })}
                </div>
              ) : null}
              {open ? (
                <button onClick={closeMenu}>Close</button>
              ) : (
                <button onClick={openMenu}>OPEN</button>
              )}
              <button onClick={this.testQuery}>QUERY</button>
            </div>
          );
        }}
      </SuggestionSearch>
    );
  }
}

export default withApollo(Usage);
