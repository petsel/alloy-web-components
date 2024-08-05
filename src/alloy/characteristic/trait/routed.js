/**
 * @param {DataObject} state
 *  - A custom-element's internal state object
 *    which, througout a custom-elemnt's entire
 *    lifetime, gets shared amongts any involved
 *    sub-classed prototype and any applied trait.
 *  - This object is supposed to be treated as
 *    protected which means it should never be
 *    exposed into public as writable.
 * @param {ElementInternals} internals
 *  - A custom-element's `internals` object
 *    which, througout a custom-elemnt's entire
 *    lifetime, gets shared amongts any involved
 *    sub-classed prototype and any applied trait.
 *  - This object is supposed to be treated as
 *    protected which means it should never be
 *    exposed into public as writable.
 */
export function withRoutes(state, internals) {
  const compound = this;
}