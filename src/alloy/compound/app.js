import { BaseAlloy, alloy, interconnect } from './base/alloy';

/**
 * @class
 *  @extends Microstructure
 *  @protected {MicrostructureData} compoundData
 */
export class App extends BaseAlloy {

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
   *    sub-classing of the `App` type itself.
   */
  constructor(connect) {

    const /** @type MicrostructureData */ compoundData = {};

    super(alloy.bind(compoundData));

    interconnect(
      compoundData,
      /** @type compoundConnector */ connect,
      /** @type compoundConnector */ data => {

        const { state, traits, trusted, internals, history, appliedTraits, observedAttrNames } = data;

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

        console.log('App ...', {
          state, traits, trusted, internals, history, appliedTraits, observedAttrNames,
        });
      },
    );
  }
}
