/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import SuggestionSearch from '../../SuggestionSearch';

describe('checks if the component is capable of splitting the changes into controlled/uncontrolled', () => {
  test('returrns empty objects if there are no changes', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();

    const changes = {};

    const partitionedChanges = instance.partitionChanges(changes);
    expect(partitionedChanges[0]).toMatchObject(changes);
    expect(partitionedChanges[1]).toMatchObject(changes);
  });
  test('all control props', () => {
    const wrapper = shallow(
      <SuggestionSearch open highlightedIndex={3} inputValue="from parent">
        {() => {}}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const changes = {
      inputValue: 'new value',
      highlightedIndex: 32,
      open: false
    };
    const partitionedChanges = instance.partitionChanges(changes);
    expect(partitionedChanges[0]).toMatchObject(changes);
    expect(partitionedChanges[1]).toMatchObject({});
  });
  test('no control props', () => {
    const wrapper = shallow(<SuggestionSearch>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const changes = {
      inputValue: 'new value',
      highlightedIndex: 32,
      open: false
    };
    const partitionedChanges = instance.partitionChanges(changes);
    expect(partitionedChanges[0]).toMatchObject({});
    expect(partitionedChanges[1]).toMatchObject({ inputValue: 'new value', highlightedIndex: 32 });
  });
  test('changes in both props and state', () => {
    const wrapper = shallow(<SuggestionSearch highlightedIndex={3}>{() => {}}</SuggestionSearch>);
    const instance = wrapper.instance();
    const changes = {
      inputValue: 'new value',
      highlightedIndex: 32,
      open: true
    };
    const partitionedChanges = instance.partitionChanges(changes);
    expect(partitionedChanges[0]).toMatchObject({ highlightedIndex: 32 });
    expect(partitionedChanges[1]).toMatchObject({ inputValue: 'new value', open: true });
  });
});
