/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for the calculateHighlightedIndex method', () => {
  test('return -1 if the menu is not open', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: false,
      highlightedIndex: 0,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(0);
    expect(highlightedIndex).toEqual(-1);
  });
  test('returns 0 if we exceed the highlightedIndex', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 2,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(0);
  });
  test('returns the last index if we move below 0', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);

    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 0,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(-1);
    expect(highlightedIndex).toEqual(2);
  });
  test('edge case where new index is 0 should just return 0', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 1,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(-1);
    expect(highlightedIndex).toEqual(0);
  });
  test('when starting from -1(menu closed or no highlight) we move to 0', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: -1,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(0);
  });
  test('edge case - last item should return last index instead of 0', () => {
    const wrapper = shallow(<SuggestionSearch>{jest.fn()}</SuggestionSearch>);
    const instance = wrapper.instance();
    instance.getMergedState = jest.fn(() => ({
      open: true,
      highlightedIndex: 1,
      suggestions: ['some', 'fake', 'suggestions']
    }));
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(2);
  });
});
