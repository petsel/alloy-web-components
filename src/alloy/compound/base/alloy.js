import { isFunction } from '../../../utility/type-detection';

// import { withElementInternalsSham } from '../../characteristic/sham/internalized';
import { attachInternals, enableWaiAria } from '../../characteristic/base/aria-enabled';
import { acquireTraits } from './casting';

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
 * @param {CompoundData} compoundData
 * 
 * @param {DataObject} compoundData.state
 *  The custom-element's protected `state` data.
 * @param {Set<ApplicapleType>} compoundData.traits
 *  The custom-element's protected `traits` set.
 * @param {ElementInternals} compoundData.internals
 *  The custom-element's protected `internals` property.
 */
function bindCompoundData(/** @type CompoundData */{ state, traits, internals } = {}) {
  Object.assign(this, {
    state,
    traits,
    internals,
  });
}
export const alloy = bindCompoundData;


const compoundRegistry = new WeakMap();

class /** @type Microstructure */  Microstructure extends HTMLElement {
  //
  // - a microstructure ...
  //
  //    - is not a homogeneous (single phase) alloy,
  //    - but a polynary heterogeneous (polyphase/multi-phase) alloy.

  /**
   * @this {Microstructure}
   * @param {Function} connect
   */
  constructor(connect) {
    super();

    const compound = this;

    
    const /** @type DataObject */ compoundState = {
      //
      // - the compound's protected, shared compound-specific
      //   state throughout the compound's entire livetime,
      //   regardless of either compund-type sub-classing
      //   or trait/mixin based compund-type composition.
      //
      // - assign some initial key value pairs if necessary.
      //
    }; /*

    // - assure some compatibility across element internals features. 
    withElementInternalsSham.call(compound);
    */
    const elementInternals = attachInternals(compound);

    // - `acquireTraits` reads and applies all of a compound's further
    //   charcteistics/traits/mixins/roles/behaviors by reading each
    //   its corresponding name from the compound's `traits` attribute.
    const acquiredTraits = acquireTraits(
      compound, compoundState, elementInternals, /* customTraitLookup, */
    );

    // - `enableWaiAria` ...
    enableWaiAria(
      compound, compoundState, elementInternals, /* customAriaConfig, */
    );

    compoundRegistry.set(
      compound,
      new Map([
        ['state', compoundState],
        ['traits', acquiredTraits],
        ['internals', elementInternals],
      ])
    );

    if (isFunction(connect)) {
      connect({
        state: compoundState,
        traits: acquiredTraits,
        internals: elementInternals,
      });
    }
  }

  getState() {
    return Object.freeze(compoundRegistry.get(this)?.get?.('state'));
  }
  getTraits() {
    return Object.freeze(compoundRegistry.get(this)?.get?.('traits'));
  }
  getInternals() {
    compoundRegistry.get(this)?.get?.('internals');
  }
}
export const /** @type Microstructure */ BaseAlloy = Microstructure;
