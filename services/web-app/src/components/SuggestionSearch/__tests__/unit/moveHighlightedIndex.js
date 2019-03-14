/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../../SuggestionSearch/changeTypes';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for the moveHighlightedIndex method', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

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
  });
  test('calls internalSetState as expected', () => {
    const wrapper = shallow(
      <SuggestionSearch
        openByDefault
        highlightedOnStart={3}
        defaultSuggestions={defaultSuggestions}
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const setStateSpy = jest.spyOn(instance, 'internalSetState');
    const mergedStateSpy = jest.spyOn(instance, 'getMergedState').mockImplementation(() => ({
      inputValue: 'any',
      suggestions: ['first', 'second', 'third']
    }));
    const calculateIndexSpy = jest
      .spyOn(instance, 'calculateHighlightedIndex')
      .mockImplementation(() => 1);
    instance.moveHighlightedIndex(1, changeTypes.inputChange, { preventDefault: () => {} });
    expect(setStateSpy).toHaveBeenCalledTimes(1);
    expect(setStateSpy).toHaveBeenCalledWith(
      {
        highlightedIndex: 1,
        inputValue: 'second',
        open: true
      },
      changeTypes.inputChange
    );
  });
});
