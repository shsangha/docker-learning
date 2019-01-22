/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../SuggestionSearch';

describe('tests to make sure that we can get merged state from props/state', () => {
  test('returns just the internal state when we dont use control props', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);

    const instance = wrapper.instance();

    const { highlightedIndex, open, inputValue } = instance.getMergedState();
    // expects just the default internal state
    expect(highlightedIndex).toEqual(-1);
    expect(open).toEqual(false);
    expect(inputValue).toEqual('');
  });
  test('merged state is the state of the parent when using all the control props', () => {
    const wrapper = shallow(
      <SuggestionSearch open={false} highlightedIndex={4} inputValue="from parent">
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const { highlightedIndex, open, inputValue } = instance.getMergedState();
    // expect that all the state is coming from props so just that is returned
    expect(highlightedIndex).toEqual(4);
    expect(inputValue).toEqual('from parent');
    expect(open).toEqual(false);
  });
  test('merged state return the combination of state/props if there is one', () => {
    const wrapper = shallow(
      <SuggestionSearch inputValue="from parent">{() => {}}</SuggestionSearch>
    );

    const instance = wrapper.instance();

    const { highlightedIndex, open, inputValue } = instance.getMergedState();
    expect(highlightedIndex).toEqual(-1); // the default internal state
    expect(open).toEqual(false); // from internal state
    expect(inputValue).toEqual('from parent'); // control prop
  });
});
