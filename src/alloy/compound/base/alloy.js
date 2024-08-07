import { createBrowserHistory } from 'history';

import { isFunction } from '../../../utility/type-detection';

// import { withElementInternalsSham } from '../../characteristic/sham/internalized';
import { attachInternals, enableWaiAria, elementInternalsRegistry as internalsRegistry  } from '../../characteristic/base/aria-enabled';
import { acquireTraits, traitRegistry } from './casting';

import { event as trustedEvent } from './trusted';


const isValidCompoundLifeCycleEvent = trustedEvent.isValidLifeCycle;

function handleCompoundLifeCycleEvent(evt) {
  // debugger;
  if (!isValidCompoundLifeCycleEvent(evt)) {

    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }
}
const compoundRegistry = new WeakMap();

const /** @type RemixBrowserHistory */ browserHistory = createBrowserHistory();


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
        },
      ),
    );

    // - `acquireTraits` reads and applies all of a compound's further
    //   charcteistics/traits/mixins/roles/behaviors by reading each
    //   its corresponding name from the compound's `traits` attribute.

    const /** @type TraitIndex */ acquiredTraits =
      acquireTraits(compound, compoundData, /* customTraitLookup, */);

    const /** @type MicrostructureData */ microstructureData = Object.freeze(
      Object.assign(
        Object.create(null),
        compoundData, {
          traits: acquiredTraits,
        },
      ),
    );

    // - `enableWaiAria` ...

    enableWaiAria(compound, compoundData /* , customAriaConfig */);

    compoundRegistry.set(
      compound,
      new Map([
        ['state', compoundState],
        ['trusted', trustedOptions],
        ['internals', elementInternals],
        ['history', browserHistory],
        ['traits', acquiredTraits],
      ]),
    );
    if (isFunction(connect)) {

      connect(microstructureData);
    }
    // compound.#trustedEvent = trustedOptions.event;

    compound.addEventListener('compound-connected', handleCompoundLifeCycleEvent);
    compound.addEventListener('compound-disconnected', handleCompoundLifeCycleEvent);
    compound.addEventListener('compound-adopted', handleCompoundLifeCycleEvent);
    compound.addEventListener('compound-attribute-changed', handleCompoundLifeCycleEvent);
  }

  connectedCallback() {
    const compound = this;
    const { Event } = trustedEvent;

    compound.dispatchEvent(
      new Event('compound-connected'/*, {

        // bubbles: false, cancelable: false, composed: false,
        //
        // - since the above present the default options,
        //   one does not need to provide them explicitly.

      }*/),
    );
  }
  disconnectedCallback() {
    const compound = this;
    const { Event } = trustedEvent;

    compound.dispatchEvent(
      new Event('compound-disconnected'),
    );
    internalsRegistry.delete(compound);
    traitRegistry.delete(compound);

    compoundRegistry.delete(compound);
  }
  adoptedCallback() {
    const compound = this;
    const { Event } = trustedEvent;

    compound.dispatchEvent(
      new Event('compound-adopted'),
    );
    internalsRegistry.delete(compound);
    traitRegistry.delete(compound);

    compoundRegistry.delete(compound);
  }
  attributeChangedCallback(name, recent, current) {
    const compound = this;
    const { CustomEvent } = trustedEvent;

    compound.dispatchEvent(
      new CustomEvent('compound-attribute-changed', {
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
