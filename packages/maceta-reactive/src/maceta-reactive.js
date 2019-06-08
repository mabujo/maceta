/* eslint-disable no-param-reassign */
export const CHANGE_TYPES = {
  ADD: 'add',
  UPDATE: 'update',
  REMOVE: 'remove'
};

export const isObject = o => o instanceof Object && o.constructor === Object;

export const getChangeObject = ({ target, key, value, type }) => {
  const changeObject = {
    name: key,
    object: target,
    type
  };
  if (value) {
    changeObject.newValue = value;
  }
  return changeObject;
};

export const observe = (object, fn, parent, originalName) =>
  new Proxy(object, {
    set(target, key, value) {
      const oldValue = target[key];
      if (oldValue === value) return true;

      const currentChange = getChangeObject({
        target: parent || target,
        key: originalName || key,
        value,
        type: typeof oldValue === 'undefined' ? CHANGE_TYPES.ADD : CHANGE_TYPES.UPDATE
      });

      if (currentChange.type === CHANGE_TYPES.UPDATE) {
        currentChange.oldValue = oldValue;
      }

      if (isObject(value) || Array.isArray(value)) {
        target[key] = observe(value, fn, target, key);
      } else {
        target[key] = value;
      }

      fn(currentChange);
      return true;
    },
    deleteProperty(target, key) {
      if (target[key] === undefined) {
        return true;
      }

      delete target[key];

      const currentChange = getChangeObject({
        target,
        key,
        type: CHANGE_TYPES.REMOVE
      });

      fn(currentChange);
      return true;
    }
  });
