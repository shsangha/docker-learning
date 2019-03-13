/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { shallow, mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

const defaultSuggestions = ['one', 'two', 'three', 'four', 'five', 'six'];

describe('tests for the calculateHighlightedIndex method', () => {
  test('return -1 if the menu is not open', () => {
    const wrapper = mount(
      <SuggestionSearch defaultSuggestions={defaultSuggestions}>
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(0);
    expect(highlightedIndex).toEqual(-1);
    wrapper.unmount();
  });
  test('returns 0 if we exceed the highlightedIndex', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={5}
        openByDefault
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(0);
    wrapper.unmount();
  });
  test('returns the last index if we move below 0', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={0}
        openByDefault
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(-1);
    expect(highlightedIndex).toEqual(5);
  });
  test('edge case where new index is 0 should just return 0', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={1}
        openByDefault
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(-1);
    expect(highlightedIndex).toEqual(0);
    wrapper.unmount();
  });
  test('when starting from -1(menu closed or no highlight) we move to 0', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={-1}
        openByDefault
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(0);
    wrapper.unmount();
  });
  test('edge case - last item should return last index instead of 0', () => {
    const wrapper = mount(
      <SuggestionSearch
        defaultSuggestions={defaultSuggestions}
        highlightedOnStart={4}
        openByDefault
      >
        {({ getInputProps }) => <input {...getInputProps()} />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const highlightedIndex = instance.calculateHighlightedIndex(1);
    expect(highlightedIndex).toEqual(5);
    wrapper.unmount();
  });
});
