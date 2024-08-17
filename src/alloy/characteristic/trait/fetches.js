import { execute as executeSafely } from '../../../utility/try-catch';
import { event as trustedEvent } from '../../compound/base/trusted';


const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


const defaultValueKey = Symbol('default-value-key');

const fetchModeLookup = new Map([
  // see ... [https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#mode]

  ['same-origin', true],  // Disallows cross-origin requests completely.
  ['cors', true],         // If the request is cross-origin then it will use the Cross-Origin Resource Sharing (CORS) mechanism.
  ['no-cors', true],      // The request must be a simple request, which restricts the headers that may be set to CORS-safelisted request headers, and restricts methods to GET, HEAD, and POST.
  ['navigate', true],     // Used only by HTML navigation. A navigate request is created only while navigating between documents.
  ['websocket', true],    // Used only when establishing a WebSocket connection.

  [defaultValueKey, 'cors'],
]);

const supportedFetchOptionAttributes = new Map([
  ['fetch-mode', new Map([ ['key', 'mode'], ['lookup', fetchModeLookup] ])],
]);

/**
 * @param {Object} collector
 *  @param {Microstructure} collector.compound
 *  @param {Object} collector.options
 * @param {[string, Map<string, string|Map<string|symbol, true|string>>]} tuple
 * @returns 
 */
function aggregateFetchOptionsEntry({ compound, options }, [attrName, optionsMap]) {
  const /** @type Map<string|symbol, true|string> */ lookup = optionsMap.get('lookup');
  const /** @type string */ key = optionsMap.get('key');

  const /** @type string */ attrValue = (compound.getAttribute(attrName) ?? '')
    .trim()
    .split(/\s+/)
    .at(-1);

  const /** @type string|undefined */ value = lookup.has(attrValue)
    && attrValue
    || lookup.get(defaultValueKey);

  if (!!value) {
    options[key] = value;
  }
  return { compound, options };
}

/**
 * @param {Microstructure} compound
 * @returns {Object}
 */
function computeFetchOptions(compound) {
  return [...supportedFetchOptionAttributes.entries()]
    .reduce(aggregateFetchOptionsEntry, {
      compound,
      options: {},
    })
    .options;
}


/**
 * @param {Microstructure} compound
 * @param {CompoundData} compoundData
 * @param {TrustedCompoundEvent} evt
 */
function enableFetchingCompound(compound, compoundData, evt) {
  // trusted event guard.
  if (!isTrustedOwnEvent(evt)) {
    return;
  }
  const traitData = compoundData.traits.get('fetches');
  const { action } = traitData;

  const options = computeFetchOptions(compound);

  // @TODO ... check `location.origin` versus `location.host` versus `location.hostname`
  if (location.host === new URL(action).host) {

    options.mode = 'same-origin';
  }
  traitData.options = options;

  console.log('`enableFetchingCompound` ...', { fetch: { action, options }, compound, evt });

  compound.dispatchEvent(
    new Event('ca-connected-trait:fetches'),
  );
}


/**
 * @param {string} pathOrHref
 * @returns {string}
 */
function resolveFetchAction(pathOrHref) {
  const regXProtocol = /^\w+:/;
  const regXValidPath = /^(?:[\/]+)?[^/\s]+\/?([^/\s]+\/?)*$/u;

  const hasProtocol = regXProtocol.test(pathOrHref);
  const isValidPath = regXValidPath.test(pathOrHref);

  if (!hasProtocol && !isValidPath) {
    throw new TypeError(
      `'${ pathOrHref }' is either an unresolvable or for other reasons invalid path.`
    );
  }
  const locator = hasProtocol
    && pathOrHref
    || [location.origin, pathOrHref.replace(/^\//, '')].join('\/');

  return new URL(locator).href;
}

/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withFetch(compoundData) {
  const compound = this;

  console.log('`withFetch`');

  if (compound.hasAttribute('fetch')) {

    const [action, error] =
      executeSafely(resolveFetchAction, compound.getAttribute('fetch').trim());

    if (!error) {
      compoundData.traits.set('fetches', { action });

      compound.addEventListener('ca-connected', evt => enableFetchingCompound(compound, compoundData, evt));
    } else {
      console.warn(
        "The Alloy Compound's 'fetch'-attribute value can not be resolved into a valid reference.\n",
        error,
        '\n',
      );
    }
  } else {
    console.warn(
      new RangeError(
        "The Alloy Compound, though having applied the `fetches` trait, misses the 'fetch'-attribute.\n",
      ),
    );
  }
}
