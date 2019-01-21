/* eslint-disable no-undef */
import combineEventHandlers from '../../utils/combineEventHandlers';

const mock1 = jest.fn();
const mock2 = jest.fn();
const shouldPreventNext = e => {
  e.preventInternalEventHandlers = true;
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('calls multiple functions if preventDefault not set', () => {
  const combined = combineEventHandlers(mock1, mock2);

  combined({});

  expect(mock1).toHaveBeenCalledTimes(1);
  expect(mock2).toHaveBeenCalledTimes(1);
});

test('prevents next calls to functions if prevent default set', () => {
  const combined = combineEventHandlers(mock1, shouldPreventNext, mock2);

  combined({ preventInternalEventHandlers: false });

  expect(mock1).toHaveBeenCalledTimes(1);
  expect(mock2).toHaveBeenCalledTimes(0);
});

test('passes in additional arguments without errors', () => {
  const combined = combineEventHandlers(mock1, mock2);

  const fakeParam1 = { a: 'dfdsf' };
  const fakeParam2 = 'STRING';
  const fakeParam3 = false;

  combined(fakeParam1, fakeParam2, fakeParam3);

  expect(mock1).toHaveBeenCalledWith(fakeParam1, fakeParam2, fakeParam3);
  expect(mock2).toHaveBeenCalledWith(fakeParam1, fakeParam2, fakeParam3);
});
test('igores when there is no function passed in from parent instead of blowing up', () => {
  const combined = combineEventHandlers({}, mock1);

  combined({});

  expect(mock1).toHaveBeenCalledTimes(1);
});
