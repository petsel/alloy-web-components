/**
 * @typedef {DataObject} CompoundData
 * 
 *  @property {DataObject} state
 *  @property {TraitIndex} traits
 *  @property {ElementInternals} internals
 */


// {DataObject}
/**
 * The [`Object`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures}
 * based representation of structured pure data.
 *
 * @typedef {Object<string, (boolean|number|string|Array<DataObject>|Set<DataObject>|Map<any, DataObject>|DataObject)>} DataObject
 */


/**
 * @typedef {Object<string, DataObject>} AriaConfig
 */

/**
 * @typedef {Object<string, ApplicapleType>} TraitLookup
 */


/**
 * @typedef {Set<ApplicapleType>} TraitIndex
 */

/**
 *  Always a function which has to be applied exclusively via `call` or
 *  `apply` to an object- respectively node-instance. Such a function is
 *  always `this` context aware and implements at least one method which
 *  gets assigned to `this`.
 *  At application time such a function can accept and operate upon (an)
 *  additionally provided argument/s. Such an applicaple type can also
 *  be referred to as _"function-based mixin"_.
 *  
 * @typedef {Function} ApplicapleType
 */


/**
 * @typedef {WeakMap<Microstructure, ElementInternals>} InternalsRegistry
 */

/**
 * @external ElementInternals
 *  @see [`Web components::ElementInternals`]{@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals}
 */

/**
 *  In terms of the _**alloy**_ analogy borrowed from metallurgic terms,
 *  `Microstructure` is the base-alloy of every yet to be written future
 *  custom-element type/class.
 * 
 *  And since this base-alloy serves as a mental abstraction for custom
 *  composable alloys, any such microstructure already is a mix of more
 *  than just two components/ingredients, thus, in terms of alloys the
 *  mixed compound/product is not a homogeneous (single phase) alloy,
 *  but a polynary heterogeneous (polyphase/multi-phase) alloy.
 *  
 *  From the programming perspective every instance of a yet to be written
 *  future custom-element type/class will have a `Microstructure` instance
 *  as its prototype since the **Alloy Custom Elements** library encourages
 *  the sub-classing of `Microstructure` respectively `BaseAlloy` where the
 *  latter is just the alias name of the former.
 * 
 *  `Microstructure` itself does sub-class respectively extend `HTMLElement`.
 *
 * @typedef {HTMLElement} Microstructure
 */

/**
 * @external HTMLElement
 *  @see [`HTML DOM API::HTMLElement`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
 */
