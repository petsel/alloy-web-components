import { BaseAlloy, alloy, interconnect } from './base/alloy';

/**
 * @class
 *  @extends Microstructure
 *  @protected {MicrostructureData} compoundData
 *  @static {Array} [observedAttributes]
 */
export class Page extends BaseAlloy {

  static get observedAttributes() {
    return ['paths'];
  }
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
   *    sub-classing of the `Page` type itself.
   */
  constructor(connect) {

    const /** @type MicrostructureData */ compoundData = {};

    super(alloy.bind(compoundData));

    // console.log('+++ Page Bootstrap Begin ...', performance.now() , ' +++');

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

        this.#state.compoundName = this.localName;
        this.#internals.role = (this.getAttribute('role') ?? '').trim() || 'page';

        console.log('Page ...', {
          state, traits, trusted, internals, history, appliedTraits, observedAttrNames,
        });
      },
    );
    this.addEventListener('ca-path-change', evt => {
      console.log({ 
        hasMatchingPath: evt.currentTarget.hasMatchingPath,
        compound: this,
        evt,
       });
    });
    this.addEventListener('ca-connected-trait:fetching', evt => {
      console.log({ 
        'fetch-action': this.#traits.get('fetching').action,
        compound: this,
        evt,
      });
      // console.log('+++ Page Bootstrap End ...', performance.now() , ' +++');
    });
  }
}
