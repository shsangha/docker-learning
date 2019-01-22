/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState and onSelect with the expected values', () => {
  const fakeOnSelect = jest.fn();

  const fakeEvent = {
    target: {
      innerText: 'SOME INNER TEXT'
    }
  };

  const wrapper = shallow(<SuggestionSearch onSelect={fakeOnSelect}>{() => {}}</SuggestionSearch>);
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  instance.handleItemClick(fakeEvent);
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith({ open: false }, changeTypes.itemSelected);
  expect(instance.props.onSelect).toHaveBeenCalledTimes(1);
  expect(instance.props.onSelect).toHaveBeenCalledWith(fakeEvent.target.innerText);
});
