/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSeach from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState properly when input_handleClick is called', () => {
  const wrapper = shallow(<SuggestionSeach>{() => {}}</SuggestionSeach>);
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  instance.input_handleClick({});
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith(
    {
      open: true
    },
    changeTypes.inputFocus
  );
});
