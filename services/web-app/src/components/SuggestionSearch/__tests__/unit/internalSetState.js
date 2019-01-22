/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { mount } from 'enzyme';
import SuggestionSearch from '../../../SuggestionSearch';
import changeTypes from '../../../SuggestionSearch/changeTypes';
import checkScrollNeeded from '../../utils/checkScrollNeeded';

jest.mock('../../../SuggestionSearch/utils/checkScrollNeeded');
const fakeParentChangeFunc = jest.fn();

describe('makes sure function flows as expected', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('state updater function with changes on both props and state', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch onParentStateChange={fakeParentChangeFunc} open>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    instance.filterChanges = jest.fn((changes, state) => changes);
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const reducerSpy = jest.spyOn(instance.props, 'onParentStateChange');
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });

    const changes = () => ({
      highlightedIndex: 4,
      inputValue: 'change',
      open: false
    });

    instance.internalSetState(changes, changeTypes.inputChange);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    expect(reducerSpy).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  test('state updater function when all state comes from control props', () => {
    const wrapper = mount(
      <SuggestionSearch
        onParentStateChange={fakeParentChangeFunc}
        open
        highlightedIndex={3}
        inputValue="from parent"
      >
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const changeObj = {
      inputValue: 'changed',
      highlightedIndex: 2,
      open: false
    };
    const changes = () => changeObj;
    instance.internalSetState(changes, changeTypes.inputChange);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(1);
    expect(instance.props.onParentStateChange).toHaveBeenCalledWith(
      changeObj,
      changeTypes.inputChange
    );
    expect(instance.getMergedState()).toMatchObject({
      inputValue: 'from parent',
      highlightedIndex: 3,
      open: true
    });

    wrapper.unmount();
  });
  test('state updater function when all the state is internal', () => {
    checkScrollNeeded.mockReturnValue(false);

    const wrapper = mount(
      <SuggestionSearch onParentStateChange={fakeParentChangeFunc}>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const changeObj = {
      inputValue: 'changed',
      highlightedIndex: 2,
      open: true
    };
    const changes = () => changeObj;
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(0);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
  test('state changes as object all internal state', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch onParentStateChange={fakeParentChangeFunc}>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const changes = {
      inputValue: 'changed',
      highlightedIndex: 2,
      open: true
    };
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
  test('state changes as object all external state', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch
        open={false}
        highlightedIndex={3}
        inputValue="init"
        onParentStateChange={fakeParentChangeFunc}
      >
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const changes = {
      inputValue: 'changed',
      highlightedIndex: 2,
      open: true
    };
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(0);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(0);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  test('state changes as object mixed state', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch open inputValue="init" onParentStateChange={fakeParentChangeFunc}>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const filterSpy = jest.spyOn(instance, 'filterChanges');
    const partitionSpy = jest.spyOn(instance, 'partitionChanges');
    const changes = {
      inputValue: 'init',
      highlightedIndex: 2,
      open: true
    };
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(partitionSpy).toHaveBeenCalledTimes(1);
    // if nothing actually changed this shouldnt be called
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
});

describe('tests for the internalSetState method scrolling logic', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('scrolls when highlighted item is managed internally and changes', () => {
    // this is so scrollIntoView will be called
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const changeObj = {
      inputValue: 'new input',
      highlightedIndex: 3,
      open: true
    };
    // also makes sure changes can be a function
    const changes = () => changeObj;
    instance.internalSetState(changes, changeTypes.keyArrow);
    const state = instance.getMergedState();
    expect(state).toMatchObject(changeObj);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  test('doesnt scroll when highlightedIndex isnt managed internally', () => {
    const wrapper = mount(
      <SuggestionSearch highlightedIndex={4} onParentStateChange={fakeParentChangeFunc}>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();

    const changes = {
      highlightedIndex: 3
    };
    instance.internalSetState(changes, changeTypes.inputChange);
    expect(instance.props.onParentStateChange).toHaveBeenCalledTimes(1);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
  test('does not scroll if the change type isnt an arrow key', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });

    instance.internalSetState({ highlightedIndex: 3 }, changeTypes.itemSelected);
    instance.internalSetState({ highlightedIndex: 4 }, changeTypes.itemHover);
    instance.internalSetState({ highlightedIndex: 5 }, changeTypes.itemClicked);
    instance.internalSetState({ highlightedIndex: 6 }, changeTypes.menuOpen);
    instance.internalSetState({ highlightedIndex: 7 }, changeTypes.menuClose);
    instance.internalSetState({ highlightedIndex: 8 }, changeTypes.inputChange);
    instance.internalSetState({ highlightedIndex: 9 }, changeTypes.inputClear);
    instance.internalSetState({ highlightedIndex: 10 }, changeTypes.inputFocus);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(0);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(0);
    instance.internalSetState({ highlightedIndex: 32 }, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  test('doesnt do scroll logic if there isnt a highlighted index', () => {
    checkScrollNeeded.mockReturnValue(true);

    const wrapper = mount(
      <SuggestionSearch>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    const changes = () => ({
      highlightedIndex: -1
    });
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
  test('only scrolls if it needs to', () => {
    checkScrollNeeded.mockReturnValue(false);

    const wrapper = mount(
      <SuggestionSearch>
        {({ itemRef, menuRef }) => (
          <div ref={menuRef}>
            <li ref={itemRef}>Fake Item</li>
          </div>
        )}
      </SuggestionSearch>
    );
    const instance = wrapper.instance();
    Object.defineProperty(instance.highlightedRef.current, 'scrollIntoView', {
      value: jest.fn().mockReturnValue(true)
    });
    const changes = {
      highlightedIndex: 4
    };
    instance.internalSetState(changes, changeTypes.keyArrow);
    expect(checkScrollNeeded).toHaveBeenCalledTimes(1);
    expect(instance.highlightedRef.current.scrollIntoView).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });
});
