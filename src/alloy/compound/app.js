import { BaseAlloy, alloy, interconnect } from './base/alloy';

export class App extends BaseAlloy {

  #state;
  #traits;
  #trusted;
  #internals;
  #history;

  constructor(connect) {
    // - a provided `connect` method/function indicates
    //   the sub-classing of the `App` type itself.

    const /** @type MicrostructureData */ compoundData = {};

    super(alloy.bind(compoundData));

    interconnect(compoundData, connect, ({ state, traits, trusted, internals, history }) => {

      this.#state = state;
      this.#traits = traits;
      this.#trusted = trusted;
      this.#internals = internals;
      this.#history = history;

      this.#state.compoundName = this.localName;

      console.log('App ... { state, traits, trusted, internals, history } ...', {
        state: this.#state,
        traits: this.#traits,
        trusted: this.#trusted,
        internals: this.#internals,
        history: this.#history,
      });
    });
  }
}
