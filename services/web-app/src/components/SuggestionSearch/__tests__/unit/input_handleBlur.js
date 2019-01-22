/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

test('just need to check closeMenu is called when handleBlur is called', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const closeMenuSpy = jest.spyOn(instance, 'closeMenu');
  instance.input_handleBlur();
  expect(closeMenuSpy).toHaveBeenCalledTimes(1);
  closeMenuSpy.mockReset();
});
