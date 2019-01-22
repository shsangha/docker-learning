/* eslint-disable no-shadow */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

test('renders without blowing up', () => {});

describe('tests initilization of props/state works as expected', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);

  test('sets default props properly when none are passed in', () => {
    const {
      highlightedOnStart,
      openByDefault,
      initialInputValue,
      defaultSuggestions
    } = wrapper.instance().props;

    expect(highlightedOnStart).toEqual(-1);
    expect(openByDefault).toBe(false);
    expect(initialInputValue).toEqual('');
    expect(defaultSuggestions).toEqual(expect.arrayContaining([]));
  });
  test('state gets initialized properly when used as an uncontrolled component and no state initializers passed', () => {
    const { highlightedIndex, open, inputValue } = wrapper.state();
    expect(highlightedIndex).toEqual(-1);
    expect(open).toEqual(false);
    expect(inputValue).toEqual('');
  });
  test('state initializers from props work as expected', () => {
    const defaultSuggestions = ['a', 'b', 'c'];

    const wrapper = shallow(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={4}
        openByDefault
        initialInputValue="test"
      >
        {() => {}}
      </SuggestionSearch>
    );
    const { open, highlightedIndex, inputValue } = wrapper.state();
    expect(open).toEqual(true);
    expect(highlightedIndex).toEqual(4);
    expect(inputValue).toEqual('test');
    expect(wrapper.instance().props.defaultSuggestions).toEqual(
      expect.arrayContaining(defaultSuggestions)
    );
  });
});
