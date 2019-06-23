// eslint-disable-next-line import/no-extraneous-dependencies
import { install } from 'jasmine-check';

import { getSupportedType, getType, isFunction, isObject, isString } from '../src/typeUtils';
import { OBSERVABLE_TYPES } from '../src/CONSTANTS';

// install testcheck utils to global scope
install();

describe('when calling to getType', () => {
  it('should return false when passed null', () => {
    const type = getType(null);
    expect(type).toBeEmpty();
    expect(type).toBeString();
  });
  it('should return false when passed undefined', () => {
    const type = getType(undefined);
    expect(type).toBeEmpty();
    expect(type).toBeString();
  });
  it('should return false when passed a boolean', () => {
    const type = getType(true);
    expect(type).toBeEmpty();
    expect(type).toBeString();
  });
  it('should return Object passed an object', () => {
    const testObjectType = getType({ a: 'a', b: 'b', c: 'c' });
    expect(testObjectType).toBe(OBSERVABLE_TYPES.OBJECT);
  });
  it('should return Array when passed an array', () => {
    const testObjectType = getType(['a', 'b', 'c']);
    expect(testObjectType).toBe(OBSERVABLE_TYPES.ARRAY);
  });
  it('should return String when passed a string', () => {
    const testObjectType = getType('abc');
    expect(testObjectType).toBe(OBSERVABLE_TYPES.STRING);
  });
});

describe('when calling to getSupportedType', () => {
  it('should return false when passed null', () => {
    expect(getSupportedType(null)).toBe(false);
  });
  it('should return false when passed undefined', () => {
    expect(getSupportedType(undefined)).toBe(false);
  });
  it('should return false when passed a boolean', () => {
    expect(getSupportedType(true)).toBe(false);
  });
  it('should return proxyable true and correct type when passed an object', () => {
    const testObjectType = getSupportedType({ a: 'a', b: 'b', c: 'c' });
    expect(testObjectType.proxyable).toBe(true);
    expect(testObjectType.type).toBe(OBSERVABLE_TYPES.OBJECT);
  });
  it('should return proxyable true and correct type when passed an array', () => {
    const testObjectType = getSupportedType(['a', 'b', 'c']);
    expect(testObjectType.proxyable).toBe(true);
    expect(testObjectType.type).toBe(OBSERVABLE_TYPES.ARRAY);
  });
  it('should return proxyable false and correct type when passed a string', () => {
    const testObjectType = getSupportedType('abc');
    expect(testObjectType.proxyable).toBe(false);
    expect(testObjectType.type).toBe(OBSERVABLE_TYPES.STRING);
  });
});

describe('when checking if an item is a function', () => {
  it('should return true when passed a function', () => {
    expect(isFunction(() => {})).toBeTruthy();
    expect(
      isFunction(function testFunction() {
        return false;
      })
    ).toBeTruthy();
    // eslint-disable-next-line no-new-func
    expect(isFunction(new Function('return true'))).toBeTruthy();
  });
});

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
  check.it('returns false when passed an array', { times: 10 }, gen.array(gen.any), testArrays => {
    expect(isObject(testArrays)).toBeFalsy();
  });
  check.it('returns false when passed a number', { times: 10 }, gen.number, testNumbers => {
    expect(isObject(testNumbers)).toBeFalsy();
  });
});

describe('when checking if an item is a string', () => {
  it('should return true when passed a string', () => {
    expect(isString('hello world')).toBeTruthy();
    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String('hello world'))).toBeTruthy();
  });
  it('should return false when passed a number', () => {
    expect(isString(123)).toBeFalsy();
  });
  it('should return false when passed an object', () => {
    expect(isString({ a: 'hello world' })).toBeFalsy();
  });
  check.it('should return true when passed any string', { times: 10 }, gen.string, testStrings => {
    expect(isString(testStrings)).toBeTruthy();
  });
});
