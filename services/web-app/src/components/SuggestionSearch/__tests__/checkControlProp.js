/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../SuggestionSearch';

describe('tests the ability to check if a piece of state belongs to state or props', () => {
  test('all state are control props', () => {
    const wrapper = shallow(
      <SuggestionSearch open={false} highlightedIndex={3} inputValue="from parent">
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();

    expect(instance.checkControlProp('open')).toBe(true);
    expect(instance.checkControlProp('highlightedIndex')).toBe(true);
    expect(instance.checkControlProp('inputValue')).toBe(true);
  });
  test('all state coming from internal state', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();

    expect(instance.checkControlProp('open')).toBe(false);
    expect(instance.checkControlProp('highlightedIndex')).toBe(false);
    expect(instance.checkControlProp('inputValue')).toBe(false);
  });
  test('state coming from both state and props', () => {
    const wrapper = shallow(
      <SuggestionSearch open={false} highlightedIndex={3}>
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();

    expect(instance.checkControlProp('open')).toBe(true);
    expect(instance.checkControlProp('highlightedIndex')).toBe(true);
    expect(instance.checkControlProp('inputValue')).toBe(false);
  });
});
