import { executeOnce } from '../../../utility/Function.once';
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
debugger;
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
 * @param {CompoundData} compoundData 
 */
export function complementMutationHandling(compound, compoundData) {
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
  
    compound.addEventListener('ca-disconnected', disconnect, { signal: controller.signal });
    compound.addEventListener('ca-adopted', disconnect, { signal: controller.signal });
  
    observer.observe(compound, { attributes: true });

    const reassignmentController = new AbortController;
    compound.addEventListener(
      'ca-connected',
      reassignAdditionalAttributes.once(compound, reassignmentController, additionalAttributes),
      { signal: reassignmentController.signal },
    );
  }
}
