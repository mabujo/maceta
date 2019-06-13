import { install } from 'jasmine-check';

import { isObject } from '../src/maceta-reactive';

// install testcheck utils to global scope
install();

describe('when checking if a variable is an object', () => {
  it('should return true when passed an object', () => {
    const testObj = {};
    const testObjConstructor = new Object();
    expect(isObject(testObj)).toBeTruthy();
    expect(isObject(testObjConstructor)).toBeTruthy();
  });
  check.it('returns false when passed an array', gen.array, arrays => {
    expect(isObject(arrays)).toBeFalsy();
  });
  check.it('returns false when passed a number', gen.number, numbers => {
    expect(isObject(numbers)).toBeFalsy();
  });
});
