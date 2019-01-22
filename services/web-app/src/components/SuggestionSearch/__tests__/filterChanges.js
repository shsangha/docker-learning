/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../SuggestionSearch';

describe('test if filter function can return an object with only state that is changing', () => {
  test('detects change and return just those', () => {
    const wrapper = shallow(<SuggestionSearch open={false}>{() => {}}</SuggestionSearch>);

    const state = wrapper.state();
    const instance = wrapper.instance();

    // nice extra check on getMergedState as it is called on state being initilized in the constructor
    expect(state).toMatchObject({
      open: false,
      highlightedIndex: -1,
      inputValue: ''
    });

    const changes = {
      open: true,
      highlightedIndex: -1,
      inputValue: ''
    };

    const actualChanges = instance.filterChanges(changes, state);
    expect(actualChanges).toMatchObject({
      open: true
    });
  });
  test('return the original change object if all the state changes', () => {
    const wrapper = shallow(
      <SuggestionSearch inputValue="from parent">{() => {}}</SuggestionSearch>
    );
    const state = wrapper.state();
    const instance = wrapper.instance();
    expect(state).toMatchObject({
      open: false,
      inputValue: 'from parent',
      highlightedIndex: -1
    });
    const changes = {
      open: true,
      inputValue: 'changing',
      highlightedIndex: 3
    };
    const actualChanges = instance.filterChanges(changes, state);
    expect(actualChanges).toMatchObject(changes);
  });
  test('returns an empty object if the original state hasnt changed', () => {
    const wrapper = shallow(
      <SuggestionSearch open highlightedIndex={3}>
        {() => {}}
      </SuggestionSearch>
    );
    const state = wrapper.state();
    const instance = wrapper.instance();
    expect(state).toMatchObject({
      open: true,
      inputValue: '',
      highlightedIndex: 3
    });
    const changes = {
      open: true,
      inputValue: '',
      highlightedIndex: 3
    };
    const actualChanges = instance.filterChanges(changes, state);
    expect(actualChanges).toMatchObject({});
  });
});
