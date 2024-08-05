import { isFunction } from '../../../utility/type-detection';

// import { withElementInternalsSham } from '../../characteristic/sham/internalized';
import { withEnableWaiAria } from '../../characteristic/base/aria-enabled';
import { withAcquireTraits } from './casting';

const compoundRegistry = new WeakMap();

function handleCompoundDataAssignement(compoundData, connectSuper, connectCompound) {
  if (isFunction(connectSuper)) {

    // - achieve compound-data connection by forwarding/channeling the data to
    //   the `connect` method which has been provided with the `constructor`'s
    //   invocation, thus indicating the sub-classing clause/case.
    connectSuper(compoundData);

  } else {

    // - no sub-classing ... achieve compound-data connection by passing the
    //   data to the instance's own `connect` lambda-expression, an ad-hoc
    //   provided/created arrow-function expression which for instance is
    //   capable of handling the assignment of compound-data properties to
    //   private class properties.
    connectCompound(compoundData);
  }
}
export const interconnect = handleCompoundDataAssignement; 

function bindCompoundData({ state, traits, internals }) {
  Object.assign(this, {
    state,
    traits,
    internals,
  });
}
export const alloy = bindCompoundData;

class Microstructure extends HTMLElement {
  //
  // - a microstructure ...
  //
  //    - is not a homogeneous (single phase) alloy,
  //    - but a polynary heterogeneous (polyphase/multi-phase) alloy.

  constructor(connect) {
    super();

    const compound = this;
    const compoundState = {
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

    // - the microstructure's most important feature in terms of how it
    //   is goig to actively manage aria roles, properties and states.
    withEnableWaiAria.call(compound /*, compoundState */);

    // - the microstructure's most important feature in terms of how its
    //   charcteistics/traits/mixins/roles/behaviors are aquired/applied.
    withAcquireTraits.call(compound, compoundState);

    // - `acquireTraits` reads and applies all of a compound's further
    //   charcteistics/traits/mixins/roles/behaviors by reading each
    //   its corresponding name from the compound's `traits` attribute.
    const acquiredTraits = compound.acquireTraits(/* customTraitLookup */);

    // - `enableWaiAria` executes the custom element's `attachInternals`
    //    methods and returns the result of this operation which is the
    //    element's `internals` property.
    const elementInternals = compound.enableWaiAria(/* customAriaConfig */);

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
export const BaseAlloy = Microstructure;
