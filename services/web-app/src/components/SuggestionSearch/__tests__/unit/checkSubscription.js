/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import { throwError, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import SuggestionSearch from '../../../SuggestionSearch';

const defaultSuggestions = ['default', 'suggestions'];

describe('tests that the subscription subcribes/unsubcscibes when it is meant to ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('calls unscubscribe when component unmounts', () => {
    const mountSpy = jest.spyOn(SuggestionSearch.prototype, 'componentDidMount');
    const unMountSpy = jest.spyOn(SuggestionSearch.prototype, 'componentWillUnmount');
    const wrapper = mount(
      <SuggestionSearch>{({ getInputProps }) => <input {...getInputProps()} />}</SuggestionSearch>
    );
    const instance = wrapper.instance();
    expect(mountSpy).toHaveBeenCalledTimes(1);
    expect(unMountSpy).toHaveBeenCalledTimes(0);
    expect(instance.subscription.closed).toEqual(false);
    wrapper.unmount();
    expect(unMountSpy).toHaveBeenCalledTimes(1);
    expect(instance.subscription.closed).toBeTruthy();
  });
  test('actually responds to input change', () => {
    const checkStreamTransformCalled = $input => {
      return $input.pipe(
        map(input => {
          expect(input).toEqual('Test');
        })
      );
    };
    const wrapper = mount(
      <SuggestionSearch
        streamTransform={checkStreamTransformCalled}
        defaultSuggestions={defaultSuggestions}
      >
        {({ getInputProps }) => <input type="text" {...getInputProps()} />}
      </SuggestionSearch>
    );
    const input = wrapper.find('input');
    const node = input.getDOMNode();
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    const event = new Event('input', { bubbles: true });

    setValue.call(node, 'Test');
    node.dispatchEvent(event);
    wrapper.unmount();
  });
});
