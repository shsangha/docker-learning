/* eslint-disable no-undef */
import deepmerge from 'deepmerge';
import isEmptyObj from '../utils/isEmptyObj';

test('merges properly', () => {
  const rootErrors = {
    a: {
      b: {
        some: 'root error'
      }
    }
  };

  const fieldErrors = {
    a: {
      b: {
        b: null,
        1: 'still here'
      }
    }
  };

  const mergeNames = key => (root, field) =>
    deepmerge(isEmptyObj(root) ? root : { [`${key}`]: root }, field);

  const options = {
    customMerge: key => {
      if (key === 'b') {
        console.log('caught');
        return mergeNames(key);
      }
    }
  };

  const res = deepmerge(rootErrors, fieldErrors, options);

  console.log(JSON.stringify(res, null, 2));

  expect(true).toEqual(false);
});
