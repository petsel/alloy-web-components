import { BaseAlloy, alloy, interconnect } from '../../base/alloy';

export class Router extends BaseAlloy {
  #state;
  #traits;
  #internals;

  constructor(connect) {
    // - a provided `connect` method/function indicates
    //   the sub-classing of the `Router` type itself.

    const compoundData = {/* state, traits, internals */};

    super(alloy.bind(compoundData));

    interconnect(compoundData, connect, ({ state, traits, internals }) => {

      this.#state = state;
      this.#traits = traits;
      this.#internals = internals;
    });
  }
}
