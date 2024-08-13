import { getFunctionName, isFunction, isAbortController } from "./type-detection";

/**
 * @param {Function} proceed  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgs 
 * @returns {Function}
 */
function asExecuteOnceModification(proceed, target, boundArgsAndOrController) {
    'use strict';

    const controller = boundArgsAndOrController.at(-1);
    const boundArgs = boundArgsAndOrController.slice(0, -1);

    const modifiedName = `once ${ getFunctionName(proceed) ?? 'anonymous' }`;
    const hasController = isAbortController(controller);

    if (!hasController && (typeof controller !== 'undefined')) {
        // - restore the arguments array to its initially intended form.
        boundArgs.unshift(controller);
    }
    let canBeInvoked = true;

    const executeOnce = ({
      [modifiedName]: function (...args) {
        let result;

        if (canBeInvoked) {
          result = proceed.apply((target ?? this), boundArgs.concat(args));

          if (hasController) {
            controller.abort();
          }
          canBeInvoked = false;
        }
        return result;
      },
    })[modifiedName];

    Reflect.defineProperty(executeOnce, 'name', { value: modifiedName });
    Reflect.defineProperty(executeOnce, 'origin', { get: () => proceed });

    return executeOnce;
}

/**
 * @this {Function}  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgsAndOrController 
 * @returns {Function}
 */
function once(target, ...boundArgsAndOrController) {
    const proceed = this;

    return isFunction(proceed)
      && asExecuteOnceModification(proceed, (target ?? null), boundArgsAndOrController)
      || proceed;
}

/**
 * @param {Function} proceed  
 * @param {(Object|null)} target 
 * @param  {Array<any>} boundArgsAndOrController 
 * @returns {Function}
 */
export function executeOnce(proceed, target, ...boundArgsAndOrController) {
    return once.call(proceed, target, ...boundArgsAndOrController);
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
