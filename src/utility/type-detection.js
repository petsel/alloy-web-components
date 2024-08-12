function exposeInternalTypeSignature(value) {
  return Object.prototype.toString.call(value);
}

export function getFunctionName(fct) {
  Reflect.getOwnPropertyDescriptor(fct, 'name').value;
}

export function isFunction(value) {
  return (
    typeof value === 'function' &&
    typeof value.call === 'function' &&
    typeof value.apply === 'function'
  );
}

export function isAbortController(value) {
  return (exposeInternalTypeSignature(value) === '[object AbortController]');
}