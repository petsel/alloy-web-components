import { BaseAlloy, alloy, interconnect } from '../../base/alloy';

export class Route extends BaseAlloy {

  // #state;
  // #traits;

  // #trusted;
  // #internals;
  // #history;

  // #appliedTraits;
  // #observedAttrNames;

  constructor(connect) {
    // - a provided `connect` method/function indicates
    //   the sub-classing of the `Route` type itself.

    const /** @type CompoundData */ compoundData = Object.create(null);

    super(alloy.bind(compoundData));

    interconnect(compoundData, connect, (/* { state, traits, trusted, internals, history, appliedTraits, observedAttrNames } */) => {

      // this.#state = state;
      // this.#traits = traits;

      // this.#trusted = trusted;
      // this.#internals = internals;
      // this.#history = history;

      // this.#appliedTraits = appliedTraits;
      // this.#observedAttrNames = observedAttrNames;
    });
  }
}
