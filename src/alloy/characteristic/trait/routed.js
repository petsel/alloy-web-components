import { isHtmlLinkElement } from '../../../utility/type-detection';
import { getAttributeOr } from '../../compound/base/alloy';
import { event as trustedEvent } from '../../compound/base/trusted';

const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


/**
 * @param {ElementInternals} internals 
 * @returns {boolean}
 */
function hasMatchingPath(internals) {
  return internals.states.has('-ac-has-matching-path');
}


/**
 * @param {CompoundData} compoundData
 * @param {boolean} doesMatch
 */
function setMatchingPathState(compoundData, doesMatch) {
  const { internals: { states } } = compoundData;

  const doesHaveMatchingState =
    states.has('-ac-has-matching-path') 

  if (doesMatch && !doesHaveMatchingState) {

    states.add('-ac-has-matching-path');

  } else if (!doesMatch && doesHaveMatchingState) {

    states.delete('-ac-has-matching-path');
  }
}

/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData 
 * @param {CompoundLocation} compoundLocation
 * @param {RemixHistoryListenerData} callbackData
 *  @param {RemixHistoryLocation} callbackData.location
 */
function handleLocationChange(compoundData, compoundLocation, { location /*, ...rest */}) {
  const compound = this;

  let { currentPath, matchingPaths } = compoundLocation;
  const { pathname } = location;

  if (currentPath !== pathname) {
    const detail = {
      path: {
        recent: currentPath,
        current: pathname
      }
    }
    compoundLocation.currentPath = pathname;

    setMatchingPathState(compoundData, matchingPaths.has(pathname));

    compound.dispatchEvent(
      new CustomEvent('ca-path-change', { detail }),
    );
  }
}


/**
 * @this {Microstructure}
 * @param {TrustedCompoundCustomEvent} evt 
 */
function handleAttributeChange(evt) {
  debugger;
  const compound = this;

  if (isTrustedOwnEvent(evt)) {
    const { currentTarget, detail: { name, value: { recent } } } = evt;

    if (name === 'paths') {
      currentTarget.setAttribute('paths', recent);
    }
  }
}

/**
 * @param {Function} unlistenHistory
 * @param {AbortController} controller
 * @param {TrustedCompoundEvent} evt
 */
function unlistenHistoryAndAbort(unlistenHistory, controller, evt) {
  if (isTrustedOwnEvent(evt)) {

    unlistenHistory();
    controller.abort();
  }
}

/**
 * @param {Microstructure} compound
 * @param {CompoundData} compoundData
 * @param {TrustedCompoundEvent} evt
 */
function enableRoutedCompound(compound, compoundData, evt) {
  if (!isTrustedOwnEvent(evt)) {
    return;
  }
  console.log('`enableRoutedCompound` ...', { compound, evt });

  // // let matchingPaths = mergeIndices(new Set, createPathIndex(compound));
  const matchingPaths = new Set([getAttributeOr(compound, 'paths')]);

  const { history } = compoundData;
  const { location } = history;

  const /** @type CompoundLocation */ compoundLocation = {

    matchingPaths,

    // ... instead of ...
    // currentPath: location.pathname,
    //
    // ... the current path's value intentionally gets initialized with `null`,
    //     thus, one can invoke `handleHistoryChange({ location })` already once
    //     in order to bootstrap the compound's internals states and/or appearance.
    currentPath: null,
  };
  const handleHistoryChange = handleLocationChange.bind(compound, compoundData, compoundLocation);

  const controller = new AbortController;
  const { signal } = controller;

  const disconnect = unlistenHistoryAndAbort.bind(
    null, history.listen(handleHistoryChange), controller,
  );
  compound.addEventListener('ca-adopted', disconnect, { signal });
  compound.addEventListener('ca-disconnected', disconnect, { signal });

  compound.addEventListener('ca-attr-changed', handleAttributeChange, { signal });

  Reflect.defineProperty(compound, 'hasMatchingPath', {
    get: () => hasMatchingPath(compoundData.internals),
  });
  handleHistoryChange({ location });
}


/**
 * @param {RemixBrowserHistory} browserHistory
 * @param {Event} evt
 */
function handleHostRoute(browserHistory, evt) {
  const elmLink = evt.target.closest('a[href]');

  if (
    isHtmlLinkElement(elmLink) &&
    evt.currentTarget.contains(elmLink) &&
    (elmLink.href ?? '').startsWith(location.origin)
  ) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    evt.preventDefault();

    browserHistory.push(elmLink.href);
  }
}

/**
 * @param {Microstructure} compound
 * @param {CompoundData} compoundData
 * @param {TrustedCompoundEvent} evt
 */
function enableCompoundRoutes(compound, compoundData, evt) {
  if (!isTrustedOwnEvent(evt)) {
    return;
  }
  console.log('`enableCompoundRoutes` ...', { compound, evt });

  compound.addEventListener('click', handleHostRoute.bind(null, compoundData.history));

  compound.dispatchEvent(
    new Event('ca-connected-trait:routed'),
  );
}


/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withPaths(compoundData) {
  const compound = this;

  console.log('`withPaths`');

  // - the trait's behavior recognizes value-changes at a compound's
  //   `paths` attribute, and does handle such changes accordingly.
  compoundData.observedAttrNames.add('paths');

  if (compound.hasAttribute('paths')) {

    // - In addition the _"with routing"_ trait enables listening to
    //   browser-history changes.
    // - see ... `history.listen(handleHistoryChange)`.
    compound.addEventListener('ca-connected', evt => enableRoutedCompound(compound, compoundData, evt));
  }
  // - On top, this trait manages the browser-history's push-state
  //   for every link that points into the current host's realm and
  //   has been clicked on.
  // - see ... `addEventListener('click', handleRoute)`

  compound.addEventListener('ca-connected', evt => enableCompoundRoutes(compound, compoundData, evt));
}
