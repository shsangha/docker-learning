/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState to clear the input when called', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  instance.clearInput();
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith(
    {
      input: ''
    },
    changeTypes.inputClear
  );
});
