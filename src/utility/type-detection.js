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
}/*

export function isString(value) {
  return (exposeInternalTypeSignature(value) === '[object String]');
}*/

export function isHTMLAnchorElement(value) {
  return (exposeInternalTypeSignature(value) === '[object HTMLAnchorElement]');
}
export function isHtmlLinkElement(value) {
  return (isHTMLAnchorElement(value) && value.hasAttribute('href'));
}

export function isAbortController(value) {
  return (exposeInternalTypeSignature(value) === '[object AbortController]');
}

