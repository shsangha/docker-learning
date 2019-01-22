/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState properly', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  instance.closeMenu({});
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith(
    { open: false, inputValue: '' },
    changeTypes.menuClose
  );
  internalSetStateSpy.mockRestore();
});
