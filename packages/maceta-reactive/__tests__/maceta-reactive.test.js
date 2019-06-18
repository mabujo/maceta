// eslint-disable-next-line import/no-extraneous-dependencies
import { install } from 'jasmine-check';

import { isObject, observe } from '../src/maceta-reactive';

// install testcheck utils to global scope
install();

describe('when checking if a variable is an object', () => {
  it('should return true when passed an object', () => {
    const testObj = {};
    // eslint-disable-next-line no-new-object
    const testObjConstructor = new Object();
    expect(isObject(testObj)).toBeTruthy();
    expect(isObject(testObjConstructor)).toBeTruthy();
  });
  it('should return false when passed a function', () => {
    const testFn = function testFn(params) {
      return params;
    };
    expect(isObject(testFn)).toBeFalsy();
  });
  check.it('returns true when passed an object', { times: 10 }, gen.object(gen.any), testObjects => {
    expect(isObject(testObjects)).toBeTruthy();
  });
  check.it('returns false when passed an array', { times: 10 }, gen.array(gen.any), arrays => {
    expect(isObject(arrays)).toBeFalsy();
  });
  check.it('returns false when passed a number', { times: 10 }, gen.number, numbers => {
    expect(isObject(numbers)).toBeFalsy();
  });
});

describe('when calling to observe', () => {
  it('should call function on change', () => {
    const testObj = {};
    const testFn = jest.fn();
    const observable = observe({ object: testObj, fn: testFn });
    observable.a = 1;
    observable.a = 2;
    expect(testFn).toHaveBeenCalledTimes(2);
  });
});
