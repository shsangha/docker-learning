/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for when the enterKey method is invoked', () => {
  const fakeOnSelect = jest.fn();
  const fakeEvent = {
    preventDefault: jest.fn()
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('does nothing if there isnt no current suggetion and menu is open', () => {
    const wrapper = shallow(
      <SuggestionSearch
        open
        onSelect={fakeOnSelect}
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={-1}
      >
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();

    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleEnterKey(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(0);
    expect(instance.props.onSelect).toBeCalledTimes(0);
    expect(internalSetStateSpy).toBeCalledTimes(0);
  });
  test('does nothing if the menu isnt open and there is a higlighted item (should never actually happen unless we do that in a state reducer for some reason)', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={1}
        onSelect={fakeOnSelect}
      >
        {({ itemRef }) => (
          <div>
            <li ref={itemRef}>Fake item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleEnterKey(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(0);
    expect(instance.props.onSelect).toHaveBeenCalledTimes(0);
    expect(internalSetStateSpy).toBeCalledTimes(0);
    wrapper.unmount();
  });
  test('does nothing if the highlighted item is disabled', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={1}
        onSelect={fakeOnSelect}
        openByDefault
      >
        {({ itemRef }) => (
          <div>
            <li disabled ref={itemRef}>
              Fake item
            </li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleEnterKey(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.props.onSelect).toHaveBeenCalledTimes(0);
    expect(internalSetStateSpy).toHaveBeenCalledTimes(0);
  });
  test('calls internalSetState properly if passing all checks', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={1}
        onSelect={fakeOnSelect}
        openByDefault
      >
        {({ itemRef }) => (
          <div>
            <li ref={itemRef}>Fake item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.handleEnterKey(fakeEvent);
    expect(instance.props.onSelect).toHaveBeenCalledTimes(1);
    expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
    expect(internalSetStateSpy).toHaveBeenCalledWith({ open: false }, changeTypes.itemSelected);
    expect(instance.props.onSelect).toBeCalledWith('two');
    wrapper.unmount();
  });
});
