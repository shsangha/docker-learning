/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */

// since js-dom can't actually do any rendering offSet and height will always return zero even if we use attachOptions in enzyme
// so the only real test we can do it to stub the values and make sure the math is right

import checkScrollNeeded from '../../utils/checkScrollNeeded';

const menu = {
  scrollTop: 0,
  clientHeight: 500
};

test('returns false if the list item is completely in view ', () => {
  const item = {
    offsetTop: 0,
    clientHeight: 100
  };

  const scrollNeeded = checkScrollNeeded(menu, item);
  expect(scrollNeeded).toBeFalsy();
});

test('returns true if the item is partially in view at the bottom', () => {
  const item = {
    offsetTop: 450,
    clientHeight: 100
  };
  const scrollNeeded = checkScrollNeeded(menu, item);
  expect(scrollNeeded).toBeTruthy();
});
test('returns true if an item is partially in view at the top', () => {
  const menu = {
    scrollTop: 100,
    clientHeight: 500
  };

  const item = {
    offsetTop: 0,
    clientHeight: 100
  };
  const scrollNeeded = checkScrollNeeded(menu, item);
  expect(scrollNeeded).toBeTruthy();
});
test('returns true if the element is completely out of view at the top', () => {
  const menu = {
    scrollTop: 300,
    clientHeight: 500
  };
  const item = {
    offsetTop: 0,
    clientHeight: 100
  };
  const scrollNeeded = checkScrollNeeded(menu, item);
  expect(scrollNeeded).toBeTruthy();
});
test('returns true if item is completely out of view at the bottom', () => {
  const menu = {
    scrollTop: 300,
    clientHeight: 500
  };
  const item = {
    offsetTop: 900,
    clientHeight: 100
  };
  const scrollNeeded = checkScrollNeeded(menu, item);
  expect(scrollNeeded).toBeTruthy();
});
