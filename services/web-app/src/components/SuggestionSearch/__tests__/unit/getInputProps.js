/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

test('tests that input props are set as expected', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const inputProps = instance.getInputProps({ extra: 'string' });
  expect(inputProps).toEqual(
    expect.objectContaining({
      ref: expect.any(Object),
      value: expect.any(String),
      onChange: expect.any(Function),
      onKeyDown: expect.any(Function),
      onBlur: expect.any(Function),
      onClick: expect.any(Function),
      extra: expect.any(String)
    })
  );
});
