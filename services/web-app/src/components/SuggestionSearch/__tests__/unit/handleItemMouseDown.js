/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggeestionSearch from '../../../SuggestionSearch';

test('just need to test that e.preventDefault is called so that the input wont lose focus on an item click', () => {
  const wrapper = shallow(<SuggeestionSearch>{() => {}}</SuggeestionSearch>);
  const fakeEvent = {
    preventDefault: jest.fn()
  };
  const instance = wrapper.instance();
  instance.handleItemMouseDown(fakeEvent);
  expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
});
