/* eslint-disable no-param-reassign */
const CHANGE_TYPES = {
  ADD: 'add',
  UPDATE: 'update',
  REMOVE: 'remove'
};

/**
 * Tests if passed parameter is a true object
 * @param     {*}         item    The item to check
 * @returns   {boolean}           If this is an object
 */
const isObject = item => item instanceof Object && item.constructor === Object;

/**
 * Tests if passed paramete is a function
 * @param     {*}         item    The item to check
 * @returns   {boolean}           If the item is a function
 */
const isFunction = item => item instanceof Function;

const getChangeObject = ({ target, key, value, type }) => {
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

/**
 * @deprecated To be removed
 */
const observe = ({ object, fn, parent, originalName }) =>
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
        target[key] = observe({ value, fn, target, key });
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

const _notifyObservers = ({ target, currentChange }) => {
  if (target._macetaObservers.length) {
    target._macetaObservers.forEach(({ key, reactFunction, trackedReactives }) => {
      reactFunction(trackedReactives, currentChange, key);
    });
  }
};

// e.g. const testObservable = createObservable({ object: {a: 1} })
const createObservable = ({ object, parent, originalName }) => {
  if (object._macetaIsReactive) {
    return object;
  }
  object._macetaIsReactive = true;
  object._macetaObservers = [];

  return new Proxy(object, {
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
        target[key] = createObservable({ value, target, key });
      } else {
        target[key] = value;
      }

      _notifyObservers({ target, currentChange });

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

      _notifyObservers({ target, currentChange });
      return true;
    }
  });
};

// e.g. reaction({something: test}, (...params) => { console.log(params)})
const reaction = (trackedReactives, reactFunction) => {
  if (isObject(trackedReactives) && isFunction(reactFunction)) {
    Object.entries(trackedReactives).forEach(([key, value]) => {
      if (value._macetaIsReactive) {
        value._macetaObservers.push({ key, reactFunction, trackedReactives });
      }
    });
  }
};

export { CHANGE_TYPES, isObject, getChangeObject, observe, createObservable, reaction };
