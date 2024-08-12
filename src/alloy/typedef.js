/**
 * @typedef {Object} RemixHistoryLocation
 * 
 *  @property {string} pathname
 *  @property {string} search
 *  @property {string} hash
 *  @property {Object} state
 */

/**
 * @typedef {'POP' | 'PUSH' | 'REPLACE'} RemixHistoryAction
 */

/**
 * @typedef {object} RemixHistoryListenerData
 * 
 *  @property {RemixHistoryLocation} location
 *  @property {RemixHistoryAction} action
 */

/**
 * @callback remixHistoryListener
 *  @param {RemixHistoryListenerData} data
 */

/**
 * @typedef {Object} RemixHistory
 * 
 *  @property {RemixHistoryLocation} location
 *  @property {RemixHistoryAction} action
 *  @property {(path: string, state?: Object) => void} push
 *  @property {(path: string, state?: Object) => void} replace
 *  @property {() => void} go
 *  @property {(n: number) => void} back
 *  @property {(n: number) => void} forward
 *  @property {(listener: (location: RemixHistoryLocation, action: RemixHistoryAction) => void) => () => void} listen
 *  @property {(prompt: string | ((location: RemixHistoryLocation, action: RemixHistoryAction) => string)) => () => void} block
 *  @property {(location: RemixHistoryLocation) => string} createHref
 */

/**
 * @typedef {RemixHistory} RemixBrowserHistory
 *  @external RemixBrowserHistory
 *   @see [`history :: docs :: api-reference`]{@link https://github.com/remix-run/history/blob/dev/docs/api-reference.md#createbrowserhistory}
 */


/**
 * @typedef {Object} RouteState
 * 
 *  @property {String} currentRoute
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
 * @typedef {Set<ApplicapleType>} TraitSet
 */

/**
 * @typedef {Set<String>} StringSet
 */


// {DataObject}
/**
 * The [`Object`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object}
 * based representation of [structured data]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures}.
 * 
 *  @see[`References :: JavaScript :: Reference Standard built-in objects :: Object`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object}
 *  @see[`References :: JavaScript :: JavaScript data types and data structures`]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures}
 *
 * @typedef {Object<string, (boolean|number|string|Array<DataObject>|Set<DataObject>|Map<any, DataObject>|DataObject)>} DataObject
 */


/**
 * @typedef {Object<string, ApplicapleType>} TraitLookup
 */

/**
 * @typedef {Object<string, DataObject>} AriaConfig
 */


/**
 * @typedef {Object} TraitApplicationOptions
 * 
 *  @property {DataObject} compoundState
 *  @property {TrustedOptions} trustedOptions
 *  @property {ElementInternals} elementInternals
 *  @property {RemixBrowserHistory} browserHistory
 */

/**
 * @typedef {Object} TraitRegistrationOptions
 * 
 *  @property {Microstructure} compound
 *  @property {DataObject} compoundState
 *  @property {TrustedOptions} trustedOptions
 *  @property {ElementInternals} elementInternals
 *  @property {RemixBrowserHistory} browserHistory
 *  @property {TraitLookup} customTraitLookup
 */

/**
 * @typedef {Object} WaiAriaEnablingOptions
 * 
 *  @property {Microstructure} compound
 *  @property {DataObject} compoundState
 *  @property {ElementInternals} elementInternals
 *  @property {AriaConfig} customAriaConfig
 */


/**
 * @typedef {Event} TrustedCompoundEvent
 *  @extends Event
 */

/**
 * @typedef {CustomEvent} TrustedCompoundCustomEvent
 *  @extends CustomEvent
 */

/**
 * @typedef {Object} TrustedEventOptions
 * 
 *  @property {TrustedCompoundEvent} Event
 *  @property {TrustedCompoundCustomEvent} CustomEvent
 *  @property {Function} isTrusted
 *  @property {Function} isTrustedOwn
 */

/**
 * @typedef {Object} TrustedOptions
 * 
 *  @property {TrustedEventOptions} event
 */


/**
 * @typedef {Object} CompoundData
 *  - Any property of this data-structure, which at a compound's
 *    instantiation time has been injected into any involved sub-
 *    or super-class respectively into any applied trait, is/gets
 *    shared amongts any involved sub-classed prototype and any
 *    applied trait througout a custom-elemnt's entire lifetime.
 *  - The data-structure itself as well as any of its properties
 *    are supposed to be treated as protected, which means, none
 *    should ever be exposed into public as writable.
 *  @property {DataObject} state
 *  @property {TrustedOptions} trusted
 *  @property {ElementInternals} internals
 *  @property {RemixBrowserHistory} history
 *  @property {StringSet} observedAttrNames
 */

// /**
//  * @typedef {Object} MicrostructureData
//  *  @extends CompoundData
//  *  
//  *  @property {TraitSet} traits
//  */

/**
 * @typedef {Object} MicrostructureData
 *  - Any property of this data-structure, which at a compound's
 *    instantiation time has been injected into any involved sub-
 *    or super-class respectively into any applied trait, is/gets
 *    shared amongts any involved sub-classed prototype and any
 *    applied trait througout a custom-elemnt's entire lifetime.
 *  - The data-structure itself as well as any of its properties
 *    are supposed to be treated as protected, which means, none
 *    should ever be exposed into public as writable.
 *  @property {DataObject} state
 *  @property {TrustedOptions} trusted
 *  @property {ElementInternals} internals
 *  @property {RemixBrowserHistory} history
 *  @property {StringSet} observedAttrNames
 *  @property {TraitSet} traits
 */

/**
 * @callback compoundConnector
 *  @param {MicrostructureData} data
 */

/**
 * @typedef {HTMLElement} Microstructure
 *  @extends HTMLElement
 *  @protected {CompoundData} compoundData
 *  @protected {MicrostructureData} microstructureData
 *  @static {Array} [observedAttributes]
 */

/**
 * @typedef {WeakMap<Microstructure, ElementInternals>} InternalsRegistry
 */