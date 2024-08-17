import { BaseAlloy, alloy, interconnect } from './base/alloy';

/**
 * @class
 *  @extends Microstructure
 *  @protected {CompoundData} compoundData
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

    const /** @type CompoundData */ compoundData = Object.create(null);

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
      console.log("'ca-path-change' ... ", { 

        hasMatchingPath: evt.currentTarget.hasMatchingPath,
        compound: this,
        evt,
       });
    });/*

    this.addEventListener('ca-connected-trait:routed', evt => {
      console.log("'ca-connected-trait:routed' ... ", {

        hasMatchingPath: this.hasMatchingPath,
        compound: this,
        evt,
      });
    });*/
    this.addEventListener('ca-connected-trait:fetches', evt => {
      console.log("'ca-connected-trait:fetches' ... ", { 

        'fetch-action': this.#traits.get('fetches').action,
        'fetch-options': this.#traits.get('fetches').options,
        compound: this,
        evt,
      });
      // console.log('+++ Page Bootstrap End ...', performance.now() , ' +++');
    });
  }
}
