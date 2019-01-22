/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState with the expected defaults', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  const fakeEvent = {
    target: {
      value: 'changed'
    }
  };
  instance.input_handleChange(fakeEvent);
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith(
    {
      inputValue: 'changed',
      highlightedIndex: -1,
      open: true
    },
    changeTypes.inputChange
  );
  internalSetStateSpy.mockRestore();
});
