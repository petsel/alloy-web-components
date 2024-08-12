import { event as trustedEvent } from '../../compound/base/trusted';


const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


/**
 *
 * @param {Microstructure} compound
 */
function createRouteIndexEarly(compound) {
  const route = compound
    .getAttribute('route')
    .trim()

  console.log('createRouteIndexEarly ...', { route });
}
function handleRoute() {
}

/**
 * @this {Microstructure}
 * @param {RouteState} routeState
 * @param {RemixHistoryListenerData} callbackData 
 */
function handleLocationChange(routeState, { location /*, ...rest */}) {
  const compound = this;

  const { currentRoute } = routeState;
  const { pathname } = location;

  if (currentRoute !== pathname) {
    currentRoute = pathname;

    compound.dispatchEvent(
      new CustomEvent('ca-route-change', {
        detail: {

        },
      }),
    );
  }
}

/**
 * @param {Function} unlistenHistory 
 * @param {AbortController} controller 
 */
function unlistenHistoryAndAbort(unlistenHistory, controller) {
  unlistenHistory();
  controller.abort();
}

/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withRoutes(compoundData) {
  const compound = this;

  // - `route` is a trait-specific property
  // - the trait's behavior recognizes value-
  //   changes at a compound's `route` attribute,
  //   and does handle such changes accordingly.
  compoundData.observedAttrNames.add('route');

  const { history } = compoundData;
  const { location } = history;

  const /** @type RouteState */ routeState = {
    currentRoute: location.pathname,
  };
  const handleRouting =
    handleLocationChange.bind(compound, routeState);

  console.log('withRoutes');

  // // let matchingRouteIndex = mergeIndices(new Set, createRouteIndexEarly(compound));
  // let matchingRouteIndex = createRouteIndexEarly(compound);

  const controller = new AbortController;
  const disconnect = unlistenHistoryAndAbort.bind(
    null, history.listen(handleRouting), controller,
  );
  compound.addEventListener('ca-disconnected', disconnect, { signal: controller.signal });
  compound.addEventListener('ca-adopted', disconnect, { signal: controller.signal });

  compound.addEventListener('click', handleRoute);

  compound.addEventListener('ca-connected', evt => {
    if (isTrustedOwnEvent(evt)) {

      console.log('routed ... ca-connected ...', { node: this, evt })
    }
  });

}
