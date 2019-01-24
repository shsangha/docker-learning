/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

test('returns the expected object we spread over a list item', () => {
  const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const listItemProps = instance.getListItemProps({ index: 4, extra: 'extra prop' });
  expect(listItemProps).toEqual(
    expect.objectContaining({
      onMouseMove: expect.any(Function),
      onClick: expect.any(Function),
      onMouseDown: expect.any(Function),
      extra: expect.any(String)
    })
  );
});
