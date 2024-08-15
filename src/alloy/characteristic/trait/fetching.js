import { tryOperation } from '../../../utility/try';

import { event as trustedEvent } from '../../compound/base/trusted';


const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


/**
 * 
 * @param {Microstructure} compound 
 * @param {CompoundData} compoundData 
 * @param {TrustedCompoundEvent} evt
 */
function enableFetchingCompound(compound, compoundData, evt) {
  // trusted event guard.
  if (!isTrustedOwnEvent(evt)) {
    return;
  }
  const traitData = compoundData.traits.get('fetching');
  const { action } = traitData;
 
  console.log('`enableFetchingCompound` ...', { fetch: { action }, compound, evt });

  compound.dispatchEvent(
    new Event('ca-connected-trait:fetching'),
  );
}


/**
 * @param {string} pathOrHref
 * @returns {string}
 */
function resolveFetchAction(pathOrHref) {
  const regXUriScheme = /^\w+:/;
  const regXValidPath = /^(?:[\/]+)?[^/\s]+\/?([^/\s]+\/?)*$/u;

  const hasUriScheme = regXUriScheme.test(pathOrHref);
  const isValidPath = regXValidPath.test(pathOrHref);

  if (!hasUriScheme && !isValidPath) {
    throw new TypeError(
      `'${ pathOrHref }' is either an unresolvable or for other reasons invalid path.`
    );
  }
  const locator = hasUriScheme
    && pathOrHref
    || [location.origin, pathOrHref.replace(/^\//, '')].join('\/');

  return new URL(locator).href;
}

/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withFetching(compoundData) {
  const compound = this;

  console.log('`withFetching`');

  if (compound.hasAttribute('fetch')) {

    const [action, error] =
      tryOperation(resolveFetchAction, compound.getAttribute('fetch').trim());

    if (!error) {
      compoundData.traits.set('fetching', { action });

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
        "The Alloy Compound, though having applied the `fetching` trait, misses the 'fetch'-attribute.\n",
      ),
    );
  }
}
