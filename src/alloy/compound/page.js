import { BaseAlloy, alloy, interconnect } from './base/alloy';

export class Page extends BaseAlloy {
  #state;
  #traits;
  #internals;

  constructor(connect) {
    // - a provided `connect` method/function indicates
    //   the sub-classing of the `Page` type itself.

    const compoundData = {/* state, traits, internals */};

    super(alloy.bind(compoundData));

    interconnect(compoundData, connect, ({ state, traits, internals }) => {

      this.#state = state;
      this.#traits = traits;
      this.#internals = internals;

      this.#state.compoundName = this.localName;

      console.log('Page ... { state, traits, internals } ...', {
        state: this.#state,
        traits: this.#traits,
        internals: this.#internals,
      });
    });
  }
}
