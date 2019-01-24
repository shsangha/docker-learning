/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

test('return the expected object when called', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const stateAndHelpers = instance.getStateAndHelpers();
  expect(stateAndHelpers).toMatchObject({
    getInputProps: expect.any(Function),
    getListItemProps: expect.any(Function),
    openMenu: expect.any(Function),
    closeMenu: expect.any(Function),
    clearInput: expect.any(Function),
    menuRef: expect.any(Object),
    itemRef: expect.any(Object),
    inputRef: expect.any(Object),
    suggestions: expect.any(Array),
    highlightedIndex: expect.any(Number),
    open: expect.any(Boolean),
    inputValue: expect.any(String)
  });
});
