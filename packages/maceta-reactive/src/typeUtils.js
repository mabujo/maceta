import { OBSERVABLE_TYPES } from './CONSTANTS';

/**
 * Tests if passed parameter is a true object
 * @param     {*}         item    The item to check
 * @returns   {boolean}           If this is an object
 * @example
 * const obj = { a: 1 };
 * isObject(obj): // returns true
 */
export const isObject = item => item instanceof Object && item.constructor === Object;

/**
 * Tests if passed parameter is a function
 * @param     {*}         item    The item to check
 * @returns   {boolean}           If the item is a function
 * @example
 * const fn = function { return { a: 1 } };
 * isFunction(fn): // returns true
 */
export const isFunction = item => item instanceof Function;

/**
 * Tests if passed parameter is a string
 * @param     {*}         item    The item to check
 * @returns   {boolean}           If the item is a string
 * @example
 * const str = 'a1';
 * isObject(str): // returns true
 */
export const isString = item => typeof item === 'string' || item instanceof String;

/**
 * Tests if passed parameter can be made observable
 * @param     {*}         item    The item to check
 * @returns   {{proxyable: boolean, type: string}}    An object defining support
 * @example
 * getSupportedType({ a: 1 }); // returns { proxyable: true, type: 'Object' }
 */
export const getSupportedType = item => {
  if (isObject(item)) {
    return { proxyable: true, type: OBSERVABLE_TYPES.OBJECT };
  }
  if (Array.isArray(item)) {
    return { proxyable: true, type: OBSERVABLE_TYPES.ARRAY };
  }
  if (isString(item)) {
    return { proxyable: false, type: OBSERVABLE_TYPES.STRING };
  }
  return false;
};
