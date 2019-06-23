/**
 * @type {object}
 */
export const CHANGE_TYPES = {
  ADD: 'add',
  UPDATE: 'update',
  REMOVE: 'remove'
};

/**
 * @type {object}
 */
export const OBSERVABLE_TYPES = {
  OBJECT: 'Object',
  ARRAY: 'Array',
  STRING: 'String'
};

/**
 * @type {array}
 */
export const PROXYABLE_TYPES = [OBSERVABLE_TYPES.OBJECT, OBSERVABLE_TYPES.ARRAY];
