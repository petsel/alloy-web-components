import { isFunction, getFunctionName, isAbortController } from "./type-detection";

/**
 * @param {Function} proceed  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgs 
 * @returns {Function}
 */
function asOnceModification(proceed, target, controller, boundArgs) {
    'use strict';

    const modifiedName = `once ${ getFunctionName(proceed) ?? 'anonymous' }`;
    const hasController = isAbortController(controller);

    if (!hasController) {
        boundArgs.unshift(controller);
    }
    let canBeInvoked = true;
debugger;
    const once = ({
      [modifiedName]: function (...args) {
        let result;

        if (canBeInvoked) {
          result = proceed.apply((target || this), boundArgs.concat(args));

          if (hasController) {
            controller.abort();
          }
          canBeInvoked = false;
        }
        return result;
      },
    })[modifiedName];

    Reflect.defineProperty(once, 'name', { value: modifiedName });
    Reflect.defineProperty(once, 'origin', { get: () => proceed });

    return once;
}

/**
 * @this {Function}  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgs 
 * @returns {Function}
 */
function once(target, controller, ...boundArgs) {
    return isFunction(proceed)
      && asOnceModification(proceed, (target || null), controller, boundArgs)
      || proceed;
}

/**
 * @param {Function} proceed  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgs 
 * @returns {Function}
 */
export function executeOnce(proceed, target, ...boundArgs) {
    return once.apply(proceed, boundArgs);
}

Reflect.defineProperty(Function.prototype, 'once', {
  configurable: true,
  writable: true,
  value: once,
});
Reflect.defineProperty(Function, 'once', {
  configurable: true,
  writable: true,
  value: executeOnce,
});
