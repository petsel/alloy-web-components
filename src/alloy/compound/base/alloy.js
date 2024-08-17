import { createBrowserHistory } from 'history';

import { isFunction } from '../../../utility/type-detection';

// import { withElementInternalsSham } from '../../characteristic/sham/internalized';
import { enableWaiAria, attachInternals, elementInternalsRegistry as internalsRegistry  } from '../../characteristic/base/aria-enabled';
import { acquireTraits, traitRegistry } from './casting';

import { complementMutationHandling } from './observed';
import { event as trustedEvent } from './trusted';


const { Event, CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


/**
 * @param {CompoundData} compoundData
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
 * @param {CompoundData} [compoundData={}]
 */
function bindAndSecureCompoundData(compoundData = {}) {
  createPartiallySecuredCompoundData(this, compoundData);
}
export const alloy = bindAndSecureCompoundData;


function handleCompoundLifeCycleEvent(evt) {
  // debugger;
  if (!isTrustedOwnEvent(evt)) {

    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }
}

/** @type RemixBrowserHistory */ 
const browserHistory = createBrowserHistory();

/** @type Map<Microstructure, Map<string, Object>> */
export const compoundDataRegistry = new WeakMap;

// /** @type Map<Microstructure, Map<string, Object>> */
// const compoundRegistry = new WeakMap;


/**
 * @param {CompoundData} compoundData
 * @param {MicrostructureData} rawData
 * @returns {CompoundData}
 */
function createPartiallySecuredCompoundData(compoundData, rawData) {

  Reflect.defineProperty(compoundData, 'state', {
    enumerable: true,
    get: () => rawData.state,
  });
  Reflect.defineProperty(compoundData, 'traits', {
    enumerable: true,
    get: () => rawData.traits,
  });

  Reflect.defineProperty(compoundData, 'trusted', {
    enumerable: true,
    get: () => rawData.trusted,
  });
  Reflect.defineProperty(compoundData, 'internals', {
    enumerable: true,
    get: () => rawData.internals,
  });
  Reflect.defineProperty(compoundData, 'history', {
    enumerable: true,
    get: () => rawData.history,
  });

  Reflect.defineProperty(compoundData, 'appliedTraits', {
    enumerable: true,
    get: () => new Map([...rawData.appliedTraits.entries()]),
  });
  Reflect.defineProperty(compoundData, 'observedAttrNames', {
    enumerable: true,
    get: () => new Set([...rawData.observedAttrNames.values()]),
  });

  return Object.freeze(compoundData);
}


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
 */
class Microstructure extends HTMLElement {

  #state;
  #traits;

  #trusted;
  #internals;
  #history;

  #appliedTraits;
  #observedAttrNames;

  /**
   * @param {compoundConnector} connect
   *  - The compound and compound-data connecting callback function.
   *  - A provided `connect` callback method/function indicates the
   *    sub-classing of the `Microstructure` base-type itself.
   */
  constructor(connect) {
    super();

    const /** @type Microstructure */ compound = this;

    /**
     *  - the compound's protected, shared compound-specific
     *    state throughout the compound's entire livetime,
     *    regardless of either compund-type sub-classing
     *    or trait/mixin based compund-type composition.
     */
    const /** @type DataObject */ compoundState =
      Object.create(null);

    /*
    // - assure some compatibility across element internals features. 
    withElementInternalsSham.call(compound);
    */

    const /** @type TrustedOptions */ trustedOptions =
      Object.freeze({
        event: trustedEvent,
      });

    const /** @type ElementInternals */ elementInternals =
      attachInternals(compound);

    const /** @type MicrostructureData */ rawCompoundData =
      Object.assign(
        Object.create(null), {

          state: compoundState,
          /**
           * - A map which holds data that is specific to each applied trait.
           * - Such data gets created and added to this map only in case a
           *   trait does rely on it during the compound's entire livetime.
           */
          traits: new Map,

          trusted: trustedOptions,
          internals: elementInternals,
          history: browserHistory,

          /**
           * - The map of yet to be acquired and applied traits.
           * - At the `Microstructure` type's instantiation level this
           *   value gets aggregated with each trait application.
           */
          appliedTraits: new Map,
          /**
           * - The set of yet to be collected and  going to be observed
           *   attribute names.
           * - Throughout the entire instantiation process, which creates
           *   a chain of prototypes, this property's value gets aggregated
           *   while being channeled through every involved constructor.
           * - The fully aggregated set of attribute-names, gets assigned
           *   automatically as array to the static `observedAttributes`
           *   field of the latest involved sub-class.
           */
          observedAttrNames: new Set,
        },
      );

    const /** @type CompoundData */ compoundData =
      createPartiallySecuredCompoundData(Object.create(null), rawCompoundData);

    compoundDataRegistry.set(compound, new Map([
      ['raw', rawCompoundData],
      ['secured', compoundData],
    ]));

    /**
     * - `acquireTraits` reads and applies all of a compound's further
     *   charcteistics/traits/mixins/roles/behaviors by reading each
     *   its corresponding name from the compound's `traits` attribute.
     */
    acquireTraits(compound/*, customTraitLookup */);

    enableWaiAria(compound/*, customAriaConfig */);

    complementMutationHandling(compound);

    // compoundRegistry.set(
    //   compound,
    //   new Map([
    //
    //     ['state', compoundState],
    //     ['traits', rawCompoundData.traits],
    //
    //     ['trusted', trustedOptions],
    //     ['internals', elementInternals],
    //     ['history', browserHistory],
    //
    //     ['appliedTraits', rawCompoundData.appliedTraits],
    //     ['observedAttrNames', rawCompoundData.observedAttrNames],
    //   ]),
    // );
    if (isFunction(connect)) {

      connect(compoundData);
    } else {
      const { state, traits, trusted, internals, history, appliedTraits, observedAttrNames }
        = rawCompoundData;

      this.#state = state;
      this.#traits = traits;
      this.#trusted = trusted;

      this.#internals = internals;
      this.#history = history;

      this.#appliedTraits = appliedTraits;
      this.#observedAttrNames = observedAttrNames;

      if (this.hasAttribute('role')) {
        this.#internals.role = this.getAttribute('role').trim();
      }
      this.#state.compoundName = this.localName;

      console.log('Microstructure ...', {
        state, traits, trusted, internals, history, appliedTraits, observedAttrNames,
      });
    }
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

    compoundDataRegistry.delete(compound);
    // compoundRegistry.delete(compound);
  }
  adoptedCallback() {
    const compound = this;

    compound.dispatchEvent(
      new Event('ca-adopted'),
    );
    internalsRegistry.delete(compound);
    traitRegistry.delete(compound);

    compoundDataRegistry.delete(compound);
    // compoundRegistry.delete(compound);
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
  }
  getAppliedTraits() {
    compoundRegistry.get(this)?.get?.('appliedTraits');
  }
  getObservedAttrNames() {
    compoundRegistry.get(this)?.get?.('observedAttrNames');
  }*/
}
export const /** @type Microstructure */ BaseAlloy = Microstructure;


/**
 * @param {Microstructure} compound
 * @param {string} name
 * @param {(string|undefined)} initialValue
 * @returns {(string|null)}
 */
export function getAttributeOr(compound, name, initialValue = null) {
  return (compound.getAttribute(name) ?? initialValue)?.trim?.();
}
