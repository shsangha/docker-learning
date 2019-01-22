/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests that highlighted index is changed correctly when an item is hovered', () => {
  test('does nothing when the hovered index is already the highlighted index', () => {
    const wrapper = shallow(
      <SuggestionSearch defaultSuggestions={defaultSuggestions} highlightedOnStart={4}>
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleItemHover(4);
    expect(internalSetStateSpy).toHaveBeenCalledTimes(0);
    internalSetStateSpy.mockRestore();
  });
  test('calls internalSetState to update highlighted index when need be', () => {
    const wrapper = shallow(
      <SuggestionSearch defaultSuggestions={defaultSuggestions} highlightedOnStart={4}>
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleItemHover(2);
    expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
    expect(internalSetStateSpy).toHaveBeenCalledWith(
      {
        highlightedIndex: 2,
        inputValue: 'three'
      },
      changeTypes.itemHover
    );
    internalSetStateSpy.mockRestore();
  });
});
