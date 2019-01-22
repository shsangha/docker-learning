/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';

describe('tests the escape key functionality on the input', () => {
  test.only('blurs the input when escape is hit', () => {
    const wrapper = mount(
      <SuggestionSearch>
        {({ inputRef }) => <input className="input" ref={inputRef} type="text" />}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const input = instance.inputRef;
    input.current.focus();
    expect(document.activeElement).toEqual(input.current);
    instance.handleEscapeKey();
    expect(document.activeElement).toEqual(document.body);
    wrapper.unmount();
  });
});
