/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

test('calls internalSetState and focuses the input when called', () => {
  const wrapper = mount(
    <SuggestionSearch>{({ inputRef }) => <input type="text" ref={inputRef} />}</SuggestionSearch>
  );
  const instance = wrapper.instance();
  const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
  const fakeEvent = {};
  expect(document.activeElement).toEqual(document.body);
  instance.openMenu(fakeEvent);
  expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
  expect(internalSetStateSpy).toHaveBeenCalledWith(
    {
      open: true
    },
    changeTypes.menuOpen
  );
  expect(document.activeElement).toEqual(instance.inputRef.current);
  internalSetStateSpy.mockReset();
  wrapper.unmount();
});
