/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for when the enterKey method is invoked', () => {
  const fakeEvent = {
    preventDefault: jest.fn()
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('does nothing if there isnt no current suggetion and menu is open', () => {
    const wrapper = shallow(<SuggestionSearch onSelect={jest.fn()}>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();

    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 0,
      suggestions: []
    }));
    instance.highlightedRef = {
      current: {
        hasAttribute: jest.fn(() => false)
      }
    };
    instance.handleEnterKey(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.props.onSelect).not.toHaveBeenCalled();
    expect(internalSetStateSpy).not.toHaveBeenCalled();
  });
  test('does nothing if the menu isnt open and there is a higlighted item (should never actually happen unless we do that in a state reducer for some reason)', () => {
    const wrapper = shallow(<SuggestionSearch onSelect={jest.fn()}>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.getMergedState = jest.fn(() => ({
      open: false,
      highlightedIndex: 0,
      suggestions: ['uno']
    }));
    instance.highlightedRef = {
      current: {
        hasAttribute: jest.fn(() => false)
      }
    };
    instance.handleEnterKey(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(instance.props.onSelect).not.toHaveBeenCalled();
    expect(internalSetStateSpy).not.toHaveBeenCalled();
  });
  test('does nothing if the highlighted item is disabled', () => {
    const wrapper = shallow(<SuggestionSearch onSelect={jest.fn()}>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 0,
      suggestions: ['first', 'second', 'third']
    }));
    instance.highlightedRef = {
      current: {
        hasAttribute: jest.fn(() => true)
      }
    };
    instance.handleEnterKey(fakeEvent);
    expect(internalSetStateSpy).not.toHaveBeenCalled();
    expect(instance.props.onSelect).not.toHaveBeenCalled();
  });
  test('calls internalSetState properly if passing all checks', () => {
    const wrapper = shallow(<SuggestionSearch onSelect={jest.fn()}>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const internalSetStateSpy = jest.spyOn(instance, 'internalSetState');
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 0,
      suggestions: ['first', 'second', 'third']
    }));
    instance.highlightedRef = {
      current: {
        hasAttribute: jest.fn(() => false)
      }
    };
    instance.handleEnterKey(fakeEvent);
    expect(internalSetStateSpy).toHaveBeenCalledTimes(1);
    expect(internalSetStateSpy).toHaveBeenCalledWith({ open: false }, changeTypes.itemSelected);
    expect(instance.props.onSelect).toBeCalledWith('first');
  });
});
