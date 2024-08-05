import { isFunction } from '../../utility/type-detection';
import { BaseAlloy, alloy } from './base/alloy';

export class App extends BaseAlloy {
  #state;
  #traits;
  #internals;

  constructor(connect) {
    // - a provided `connect` method/function indicates
    //   the sub-classing of the `Page` type itself.

    const compoundData = {};

    super(alloy.bind(compoundData));

    if (isFunction(connect)) {
      // - connect/channel the compound's data due to sub-classing.

      connect(compoundData);
    } else {
      // - no sub-classing ... assign compound data e.g. as private properties.

      this.#state = compoundData.state;
      this.#traits = compoundData.traits;
      this.#internals = compoundData.internals;

      this.#state.compoundName = this.localName;

      console.log('App ... { state, traits, internals } ...', {
        state: this.#state,
        traits: this.#traits,
        internals: this.#internals,
      });
    }
  }
}
