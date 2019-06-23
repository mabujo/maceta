/* eslint-disable no-param-reassign */
import { CHANGE_TYPES, PROXYABLE_TYPES } from './CONSTANTS';
import { getSupportedType, isFunction, isObject, getType } from './typeUtils';

const _getChangeObject = ({ target, key, value, type }) => {
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
 * Add internal properties for tracking to the item
 * @param {*}       item    Item to add properties to
 * @returns         item    The mutated item
 */
const _addTrackingProperties = item => {
  item._macetaIsReactive = true;
  item._macetaObservers = [];
  item._macetaObserversId = 0; // TODO use for tracking and disposing?
  return item;
};

const _notifyObservers = ({ target, currentChangeObject }) => {
  if (target._macetaObservers.length) {
    target._macetaObservers.forEach(({ key = '', reactFunction, trackedObservables }) => {
      reactFunction(trackedObservables, currentChangeObject, key);
    });
  }
};

/**
 * Creates a Proxy and sets handler, traps
 * @param {object|array|string}     item            The item to make observable
 * @param {object}                  parent          If we are nested, we will notify the parent
 * @param {string}                  originalName    Can be passed as a key for the observable
 * @private
 */
const _createProxy = (item, { parent, originalName }) => {
  // adds internal properties
  _addTrackingProperties(item);

  return new Proxy(item, {
    set(target, key, value) {
      const oldValue = target[key];
      if (oldValue === value) return true;

      const currentChangeObject = _getChangeObject({
        target: parent || target,
        key: originalName || key,
        value,
        type: typeof oldValue === 'undefined' ? CHANGE_TYPES.ADD : CHANGE_TYPES.UPDATE
      });

      if (currentChangeObject.type === CHANGE_TYPES.UPDATE) {
        currentChangeObject.oldValue = oldValue;
      }

      if (isObject(value) || Array.isArray(value)) {
        // eslint-disable-next-line no-use-before-define
        target[key] = observable({ value, target, key });
      } else {
        target[key] = value;
      }

      _notifyObservers({ target, currentChangeObject });

      return true;
    },
    deleteProperty(target, key) {
      if (target[key] === undefined) {
        return true;
      }

      delete target[key];

      const currentChangeObject = _getChangeObject({
        target,
        key,
        type: CHANGE_TYPES.REMOVE
      });

      _notifyObservers({ target, currentChangeObject });
      return true;
    }
  });
};

const _createBox = (item, { parent, originalName }) => {
  return _createProxy(
    {
      value: item
    },
    { parent, originalName }
  );
};

/**
 * Creates an observable a passed item
 * @param {object|array|string}     item            The item to make observable
 * @param {object}                  parent          If we are nested, we will notify the parent
 * @param {string}                  originalName    Can be passed as a key for the observable
 * @example
 * const testObservable = observable({ a: 1 });
 * const testReaction = reaction({ item: testObservable, () => {
 *    console.log('changed!')
 * }});
 * testObservable.a = 2 // changed!
 * @typedef {object|array} observable               An observable item
 */
export const observable = (item, { parent, originalName } = {}) => {
  const supportedItem = getSupportedType(item);
  if (supportedItem) {
    if (item._macetaIsReactive) {
      // item is already an observable
      return item;
    }
    if (supportedItem.proxyable) {
      // item is a proxyable type e.g. object || array
      return _createProxy(item, { parent, originalName });
    }
    // item supported but requires a box
    return _createBox(item, { parent, originalName });
  }
  console.warn('Not an observable type');
  return false;
};

// e.g. reaction({something: test}, (...params) => { console.log(params)})
export const reaction = (trackedObservables, reactFunction) => {
  if (isFunction(reactFunction)) {
    if (PROXYABLE_TYPES.includes(getType(trackedObservables))) {
      if ('_macetaIsReactive' in trackedObservables) {
        trackedObservables._macetaObserversId += 1;
        const thisObserverId = trackedObservables._macetaObserversId;
        trackedObservables._macetaObservers.push({
          reactFunction,
          trackedObservables,
          _macetaObserverId: thisObserverId
        });
        // returns a disposer function
        return () => {
          const observerIndex = trackedObservables._macetaObservers.findIndex(
            item => item._macetaObserverId === thisObserverId
          );
          if (observerIndex > -1) {
            trackedObservables._macetaObservers.splice(observerIndex, 1);
          }
        };
      }
      // this is a plain object, iterate keys and observe any observables
      Object.entries(trackedObservables).forEach(([observedProperty, observableItem]) => {
        if (observableItem._macetaIsReactive) {
          observableItem._macetaObserversId += 1;
          const thisObserverId = observableItem._macetaObserversId;
          observableItem._macetaObservers.push({
            key: observedProperty,
            reactFunction,
            trackedObservables,
            _macetaObserverId: thisObserverId
          });
          // TODO: create disposer for all these observers
        }
      });
    }
  }
  return false;
};
