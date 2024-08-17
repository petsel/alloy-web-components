import { executeOnce } from '../../../utility/Function.once';

import { compoundDataRegistry } from './alloy';
import { event as trustedEvent } from './trusted';

const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


/**
 * @this {Microstructure}
 * @param {StringSet} attrNameIndex
 * @param {Array<MutationRecord>} mutationList
 */
function handleAdditionalAttributeMutation(attrNameIndex, mutationList /*, observer */) {
    const compound = this;

    mutationList
      .forEach((/** @type MutationRecord */{ target, attributeName: name, oldValue: recent }) => {
        if (
          (target === compound) &&
          attrNameIndex.has(name)
        ) {
          compound.dispatchEvent(
            new CustomEvent('ca-attr-changed', {
              detail: {
                name,
                value: {
                  recent,
                  current: compound.getAttribute(name),
                },
              },
            }),
          );
        }
      });
}

/**
 * @this {Microstructure}
 * @param {Array<string>} additionalAttributes 
 */
function reassignAdditionalAttributes(additionalAttributes, evt) {
    const compound = this;

    if (isTrustedOwnEvent(evt)) {

      additionalAttributes
        .forEach(name =>

          compound.setAttribute(name, compound.getAttribute(name))
        );
    }
}

/**
 * @param {MutationObserver} observer 
 * @param {AbortController} controller 
 */
function disconnectAndAbort(observer, controller) {
  observer.disconnect();
  controller.abort();
}


/**
 * @param {Microstructure} compound
 */
export function complementMutationHandling(compound) {
  const dataMap = compoundDataRegistry.get(compound);

  // const /** @type MicrostructureData */ rawCompoundData = dataMap.get('raw');
  const /** @type CompoundData */ compoundData = dataMap.get('secured');

  // get the custom-element type's statically served observed attributes array.
  const { observedAttributes = [] } = (compound.constructor ?? {});

  const additionalAttributes = [
    ...compoundData.observedAttrNames.difference(
      new Set(observedAttributes),
    ),
  ];

  if (additionalAttributes.length > 0) {

    const controller = new AbortController;
    const observer = new MutationObserver(
      handleAdditionalAttributeMutation.bind(compound, new Set(additionalAttributes)),
    );
    const disconnect = disconnectAndAbort.bind(null, observer, controller);
    const { signal } = controller;
  
    compound.addEventListener('ca-disconnected', disconnect, { signal });
    compound.addEventListener('ca-adopted', disconnect, { signal });
  
    observer.observe(compound, { attributes: true });

    const reassignmentController = new AbortController;
    // - IMPORTANT: do not use the `{ once: true }` [`option`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#once)
    //    - The Alloy/Microstsructure based system internally uses own trusted
    //      versions of `Event`/`CustomEvent` in order to distinguish them from
    //      naive/simple spoofing approaches.
    //    - And since any manually or 3rd party dispatched 'ca-connected' event
    //      can still trigger any handler which has been subscribed to its type,
    //      one always is endangered of loosing the correctly timed event-handling
    //      due to the `once` option.
    //    - The correct handling therefore relies on an own `once` method which
    //      has been implemented at `Function.prototype`. This method, in addition
    //      to both, the bound `thisArg`/context and all optional attributes,
    //      allows an `AbortController` instance as its last (optional) parameter.
    compound.addEventListener(
      'ca-connected',
      reassignAdditionalAttributes.once(compound, additionalAttributes, reassignmentController),
      { signal: reassignmentController.signal },
    );
  }
}
