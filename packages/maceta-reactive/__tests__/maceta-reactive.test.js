// eslint-disable-next-line import/no-extraneous-dependencies
import { install } from 'jasmine-check';

import { observable, reaction } from '../src/maceta-reactive';
import * as typeUtils from '../src/typeUtils';

// override because jest.fn() fails the check
typeUtils.isFunction = () => true;

// install testcheck utils to global scope
install();

describe('when creating an observable object', () => {
  const testBasicObject = {
    a: 1,
    b: 2,
    c: 'abc'
  };
  const observableObject = observable(testBasicObject);

  it('should return an object with reactive props', () => {
    expect(typeof observableObject === 'object').toBeTruthy();
    expect(observableObject).toHaveProperty('_macetaIsReactive');
    expect(observableObject._macetaIsReactive).toBeTruthy();
    expect(observableObject._macetaObservers).toBeArray();
  });

  it('should react to property change', () => {
    const testFn = jest.fn();
    reaction(observableObject, testFn);

    observableObject.a = 3;
    observableObject.b = 4;
    observableObject.c += 'def';
    expect(testFn).toHaveBeenCalledTimes(3);
  });
});

describe('when creating a reaction with an object observable object', () => {
  const testFn = jest.fn();
  const testObservable = observable({});
  reaction(testObservable, testFn);

  it('should add the reaction function to _macetaObservers', () => {
    expect(testObservable._macetaObservers).toBeArrayOfSize(1);
    expect(testObservable._macetaObservers[0].reactFunction).toBe(testFn);
  });

  it('should call reaction function when a property changes', () => {
    testObservable.a = 5;
    expect(testFn).toHaveBeenCalled();
  });

  it('should not react if reaction is disposed before change', () => {
    const newTestObservable = observable({});
    const newTestFn = jest.fn();
    const disposer = reaction(newTestObservable, newTestFn);
    expect(newTestObservable._macetaObservers).toBeArrayOfSize(1);
    expect(newTestObservable._macetaObservers[0].reactFunction).toBe(newTestFn);
    disposer();
    newTestObservable.a = 5;
    expect(newTestFn).not.toHaveBeenCalled();
    expect(newTestObservable._macetaObservers).toBeArrayOfSize(0);
  });
});

describe('when creating a reaction with multiple properties on a plain object', () => {
  const testFn = jest.fn();
  const testObservable = observable({});
  const secondObservable = observable([]);
  reaction({ prop: testObservable, propertyTwo: secondObservable }, testFn);

  it('should add the reaction function to _macetaObservers', () => {
    expect(testObservable._macetaObservers).toBeArrayOfSize(1);
    expect(testObservable._macetaObservers[0].reactFunction).toBe(testFn);
    expect(secondObservable._macetaObservers).toBeArrayOfSize(1);
    expect(secondObservable._macetaObservers[0].reactFunction).toBe(testFn);
  });

  it('should call reaction function when a property changes', () => {
    testObservable.a = 5;
    expect(testFn).toHaveBeenCalledTimes(1);
    secondObservable.push('a');
    expect(testFn).toHaveBeenCalledTimes(2);
  });
});
