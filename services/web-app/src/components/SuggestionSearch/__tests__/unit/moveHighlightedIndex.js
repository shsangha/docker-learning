/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../../SuggestionSearch/changeTypes';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for the moveHighlightedIndex method', () => {
  test('prevents default on the event', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const event = {
      preventDefault: jest.fn()
    };
    instance.moveHighlightedIndex(1, changeTypes.inputChange, event);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
  test('calls calculateHighlightedIndex before setting state', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const calcSpy = jest.spyOn(instance, 'calculateHighlightedIndex');
    instance.moveHighlightedIndex(1, changeTypes.inputChange, { preventDefault: () => {} });
    expect(calcSpy).toHaveBeenCalledTimes(1);
    calcSpy.mockRestore();
  });
  test('calls set state', () => {
    const wrapper = shallow(
      <SuggestionSearch
        openByDefault
        highlightedOnStart={3}
        defaultSuggestions={defaultSuggestions}
      >
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const setStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.moveHighlightedIndex(1, changeTypes.inputChange, { preventDefault: () => {} });
    expect(setStateSpy).toHaveBeenCalledTimes(1);
    expect(setStateSpy).toHaveBeenCalledWith(
      {
        highlightedIndex: 4,
        inputValue: 'five',
        open: true
      },
      changeTypes.inputChange
    );
    setStateSpy.mockRestore();
  });
});
