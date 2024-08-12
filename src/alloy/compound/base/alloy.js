import { createBrowserHistory } from 'history';

import { isFunction } from '../../../utility/type-detection';

// import { withElementInternalsSham } from '../../characteristic/sham/internalized';
import { enableWaiAria, attachInternals, elementInternalsRegistry as internalsRegistry  } from '../../characteristic/base/aria-enabled';
import { acquireTraits, traitRegistry } from './casting';

import { complementMutationHandling } from './observed';
import { event as trustedEvent } from './trusted';


const { Event, CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;

/** @type RemixBrowserHistory */ 
const browserHistory = createBrowserHistory();

/** @type Map<Microstructure, Map<string, MicrostructureData>> */
export const compoundRegistry = new WeakMap;


function handleCompoundLifeCycleEvent(evt) {
  // debugger;
  if (!isTrustedOwnEvent(evt)) {

    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }
}


/**
 * @param {MicrostructureData} compoundData
 * @param {Function} connectSuper
 * @param {Function} connectCompound
 */
function handleCompoundDataAssignement(compoundData, connectSuper, connectCompound) {
  if (isFunction(connectSuper)) {

    // - achieve compound-data connection by forwarding/channeling the data to
    //   the `connect` method which has been provided with the `constructor`'s
    //   invocation, thus indicating the sub-classing clause/case.

    connectSuper(compoundData);
  }
  if (isFunction(connectCompound)) {

    // - whether sub-classing or not ... in case this function has been provided,
    //   achieve compound-data connection by passing the data to the instance's
    //   own `connect` lambda-expression, an ad-hoc provided/created arrow-
    //   function expression, which e.g. is capable of handling the assignment
    //   of compound-data properties to private class properties.

    connectCompound(compoundData);
  }
}
export const interconnect = handleCompoundDataAssignement; 

/**
 * @this {Microstructure}
 * @param {MicrostructureData} [compoundData={}]
 */
function bindCompoundData(compoundData = {}) {
  Object.assign(this, compoundData);
}
export const alloy = bindCompoundData;


/**
 *  In terms of the _**alloy**_ analogy borrowed from metallurgic terms,
 *  `Microstructure` is the base-alloy of every yet to be written future
 *  custom-element type/class.
 * 
 *  And since this base-alloy serves as a mental abstraction for custom
 *  composable alloys, any such microstructure already is a mix of more
 *  than just two components/ingredients, thus, in terms of alloys the
 *  mixed compound/product is not a homogeneous (single phase) alloy,
 *  but a polynary heterogeneous (polyphase/multi-phase) alloy.
 *  
 *  From the programming perspective every instance of a yet to be written
 *  future custom-element type/class will have a `Microstructure` instance
 *  as its prototype since the **Alloy Custom Elements** library encourages
 *  the sub-classing of `Microstructure` respectively `BaseAlloy` where the
 *  latter is just the alias name of the former.
 * 
 *  `Microstructure` itself does sub-class respectively extends `HTMLElement`.
 *
 * @class
 *  @extends HTMLElement
 *  @protected {CompoundData} compoundData
 *  @protected {MicrostructureData} microstructureData
 */
class Microstructure extends HTMLElement {

  // #trustedEvent;

  /**
   * @this {Microstructure}
   * @param {Function} connect
   */
  constructor(connect) {
    super();

    const compound = this;
    const /** @type DataObject */ compoundState = Object.assign(

      // - the compound's protected, shared compound-specific
      //   state throughout the compound's entire livetime,
      //   regardless of either compund-type sub-classing
      //   or trait/mixin based compund-type composition.

      Object.create(null), {
 
        // - assign some initial key value pairs if necessary.
      },
    );

    /*
    // - assure some compatibility across element internals features. 
    withElementInternalsSham.call(compound);
    */

    const /** @type TrustedOptions */ trustedOptions = Object.freeze({
      event: trustedEvent,
    });
    const /** @type ElementInternals */ elementInternals =
      attachInternals(compound);

    const /** @type CompoundData */ compoundData = Object.freeze(
      Object.assign(
        Object.create(null), {
          state: compoundState,
          trusted: trustedOptions,
          internals: elementInternals,
          history: browserHistory,
          /**
           * - The set of yet to be collected and 
           *   going to be observed attribute names.
           * - Throughout the entire instantiation
           *   process, which creates a chain of
           *   prototypes, this property's value
           *   gets aggregated while being channeled
           *   through every involved constructor.
           * - The fully aggregated set of attribute-
           *   names, gets automatically assigned as
           *   array to the static `observedAttributes`
           *   field of the latest involved sub-class.
           */
          observedAttrNames: new Set,
        },
      ),
    );

    // - `acquireTraits` reads and applies all of a compound's further
    //   charcteistics/traits/mixins/roles/behaviors by reading each
    //   its corresponding name from the compound's `traits` attribute.

    const /** @type TraitSet */ acquiredTraits =
      acquireTraits(compound, compoundData, /* customTraitLookup, */);

    enableWaiAria(compound, compoundData /* , customAriaConfig */);

    complementMutationHandling(compound, compoundData);

    const /** @type MicrostructureData */ microstructureData = Object.freeze(
      Object.assign(
        Object.create(null),
        compoundData,
        { traits: acquiredTraits },
      ),
    );

    compoundRegistry.set(
      compound,
      new Map([
        ['state', compoundState],
        ['trusted', trustedOptions],
        ['internals', elementInternals],
        ['history', browserHistory],
        ['traits', acquiredTraits],
        ['observedAttrNames', compoundData.observedAttrNames],
      ]),
    );
    if (isFunction(connect)) {

      connect(microstructureData);
    }
    // compound.#trustedEvent = trustedOptions.event;

    compound.addEventListener('ca-connected', handleCompoundLifeCycleEvent);
    compound.addEventListener('ca-disconnected', handleCompoundLifeCycleEvent);
    compound.addEventListener('ca-adopted', handleCompoundLifeCycleEvent);
    compound.addEventListener('ca-attr-changed', handleCompoundLifeCycleEvent);
  }

  connectedCallback() {
    this.dispatchEvent(
      new Event('ca-connected'/*, {

        // bubbles: false, cancelable: false, composed: false,
        //
        // - since the above present the default options,
        //   one does not need to provide them explicitly.

      }*/),
    );
  }
  disconnectedCallback() {
    const compound = this;

    compound.dispatchEvent(
      new Event('ca-disconnected'),
    );
    internalsRegistry.delete(compound);
    traitRegistry.delete(compound);

    compoundRegistry.delete(compound);
  }
  adoptedCallback() {
    const compound = this;

    compound.dispatchEvent(
      new Event('ca-adopted'),
    );
    internalsRegistry.delete(compound);
    traitRegistry.delete(compound);

    compoundRegistry.delete(compound);
  }
  attributeChangedCallback(name, recent, current) {
    this.dispatchEvent(
      new CustomEvent('ca-attr-changed', {
        detail: {
          name,
          value: {
            recent,
            current,
          },
        },
      }),
    );
  }/*

  getState() {
    return Object.freeze(compoundRegistry.get(this)?.get?.('state'));
  }
  getTraits() {
    return Object.freeze(compoundRegistry.get(this)?.get?.('traits'));
  }
  getTrusteds() {
    compoundRegistry.get(this)?.get?.('trusted');
  }
  getInternals() {
    compoundRegistry.get(this)?.get?.('internals');
  }
  getHistory() {
    compoundRegistry.get(this)?.get?.('history');
  }*/
}
export const /** @type Microstructure */ BaseAlloy = Microstructure;
