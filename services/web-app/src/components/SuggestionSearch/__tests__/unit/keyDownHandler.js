/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../changeTypes';

describe('tests to make sure the right handler is called based on the event keycode', () => {
  const up = {
    keyCode: 38,
    preventDefault: jest.fn()
  };
  const down = {
    keyCode: 40,
    preventDefault: jest.fn()
  };
  const enter = {
    keyCode: 13,
    preventDefault: jest.fn()
  };
  const escape = {
    keyCode: 27,
    preventDefault: jest.fn()
  };
  const r = {
    keyCode: 82,
    preventDefault: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('nothing gets called if the key pressed was not one of they keys we want to listen to', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const moveHighlightedIndexSpy = jest.spyOn(instance, 'moveHighlightedIndex');
    const handleEnterSpy = jest.spyOn(instance, 'handleEnterKey');
    const handleEscapeSpy = jest.spyOn(instance, 'handleEscapeKey');
    instance.KeyDownHandler(r);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledTimes(0);
    expect(handleEnterSpy).toHaveBeenCalledTimes(0);
    expect(handleEscapeSpy).toHaveBeenCalledTimes(0);
  });
  test('handles up being pressed', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const moveHighlightedIndexSpy = jest.spyOn(instance, 'moveHighlightedIndex');
    const handleEnterSpy = jest.spyOn(instance, 'handleEnterKey');
    const handleEscapeSpy = jest.spyOn(instance, 'handleEscapeKey');
    instance.KeyDownHandler(up);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledTimes(1);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledWith(-1, changeTypes.keyArrow, up);
    expect(handleEnterSpy).toHaveBeenCalledTimes(0);
    expect(handleEscapeSpy).toHaveBeenCalledTimes(0);
  });
  test('handles down being pressed', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const moveHighlightedIndexSpy = jest.spyOn(instance, 'moveHighlightedIndex');
    const handleEnterSpy = jest.spyOn(instance, 'handleEnterKey');
    const handleEscapeSpy = jest.spyOn(instance, 'handleEscapeKey');
    instance.KeyDownHandler(down);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledTimes(1);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledWith(1, changeTypes.keyArrow, down);
    expect(handleEnterSpy).toHaveBeenCalledTimes(0);
    expect(handleEscapeSpy).toHaveBeenCalledTimes(0);
  });
  test('handles enter being pressed', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const moveHighlightedIndexSpy = jest.spyOn(instance, 'moveHighlightedIndex');
    const handleEnterSpy = jest.spyOn(instance, 'handleEnterKey');
    const handleEscapeSpy = jest.spyOn(instance, 'handleEscapeKey');
    instance.KeyDownHandler(enter);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledTimes(0);
    expect(handleEnterSpy).toHaveBeenCalledTimes(1);
    expect(handleEnterSpy).toHaveBeenCalledWith(enter);
    expect(handleEscapeSpy).toHaveBeenCalledTimes(0);
  });
  test('handles escape being pressed', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const moveHighlightedIndexSpy = jest.spyOn(instance, 'moveHighlightedIndex');
    const handleEnterSpy = jest.spyOn(instance, 'handleEnterKey');
    // handleEscapeKey uses refs and there wasnt really a need for it in this test
    instance.handleEscapeKey = jest.fn();
    instance.KeyDownHandler(escape);
    expect(moveHighlightedIndexSpy).toHaveBeenCalledTimes(0);
    expect(handleEnterSpy).toHaveBeenCalledTimes(0);
    expect(instance.handleEscapeKey).toHaveBeenCalledTimes(1);
  });
});
