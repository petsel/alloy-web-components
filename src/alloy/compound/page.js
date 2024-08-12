import { BaseAlloy, alloy, interconnect } from './base/alloy';

/**
 * @class
 *  @extends Microstructure
 *  @protected {MicrostructureData} compoundData
 *  @static {Array} [observedAttributes]
 */
export class Page extends BaseAlloy {

  static get observedAttributes() {
    return ['route'];
  }
  #state;
  #trusted;
  #internals;
  #history;
  #traits;
  #observedAttrNames;

  /**
   * @param {compoundConnector} connect
   *  - The compound and compound-data connecting callback function.
   *  - A provided `connect` callback method/function indicates the
   *    sub-classing of the `Page` type itself.
   */
  constructor(connect) {

    const /** @type MicrostructureData */ compoundData = {};

    super(alloy.bind(compoundData));

    interconnect(
      compoundData,
      /** @type compoundConnector */ connect,
      /** @type compoundConnector */ data => {

        const { state, trusted, internals, history, traits , observedAttrNames } = data;

        this.#state = state;
        this.#trusted = trusted;
        this.#internals = internals;
        this.#history = history;
        this.#traits = traits;
        this.#observedAttrNames = observedAttrNames;

        this.#state.compoundName = this.localName;

        console.log('Page ...', {
          state: this.#state,
          trusted: this.#trusted,
          internals: this.#internals,
          history: this.#history,
          traits: this.#traits,
          observedAttrNames: this.#observedAttrNames,
        });
      },
    );
  }
}
