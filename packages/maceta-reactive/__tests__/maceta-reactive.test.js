'use strict';

import { isObject } from '../src/maceta-reactive';

describe('when checking if a variable is an object', () => {
  it('should return true when passed an object', () => {
    const testObj = {};
    const testObjConstructor = new Object();
    expect(isObject(testObj)).toBeTruthy();
    expect(isObject(testObjConstructor)).toBeTruthy();
  });
});
