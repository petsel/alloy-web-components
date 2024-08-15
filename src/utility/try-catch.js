/**
 * @param {Function} proceed
 * @param  {Array<any>} args
 * @returns {[any, (Error|undefined)]}
 */
export function execute(proceed, ...args) {
  let result;
  let error;

  try {
    result = proceed(...args);

  } catch (/** @type {Error} */exception) {

    error = exception;
  }
  return [result, /** @type {Error|undefined} */error];
}
