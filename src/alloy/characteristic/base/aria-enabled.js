import { compoundDataRegistry } from "../../compound/base/alloy";


export const /** @type AriaConfig */ initialAriaConfig = Object.freeze({
  trait: {
    routed: {
      attrs: [{
        hidden: '',
      }],
    },
  },
  element: {
    router: {
      role: '',
      attrs: [],
      // states: [],
    },
    route: {
      role: '',
      attrs: [],
      // states: [],
    },
    app: {
      role: '',
      attrs: [],
      // states: [],
    },
    page: {
      role: 'document',
      attrs: [],
      // states: [],
    },
  },
});
export const /** @type InternalsRegistry */ elementInternalsRegistry = new WeakMap;


/**
 * @param {Microstructure} compound 
 * @returns {ElementInternals}
 */
function getElementInternals(compound) {
  return elementInternalsRegistry.get(compound);
}

/**
 * @param {Microstructure} compound 
 * @returns {ElementInternals}
 */
export function attachInternals(compound) {
  if (!elementInternalsRegistry.has(compound)) {

    elementInternalsRegistry.set(compound, compound.attachInternals?.() ?? null);

    // Reflect.defineProperty(compound, 'internals', { get: getElementInternals });
  }
  return getElementInternals(compound);
}

/**
 * @param {Microstructure} compound
 * @param {AriaConfig} [customAriaConfig]
 */
export function enableWaiAria(compound, customAriaConfig) {
  const dataMap = compoundDataRegistry.get(compound);

  // const /** @type MicrostructureData */ rawCompoundData = dataMap.get('raw');
  const /** @type CompoundData */ compoundData = dataMap.get('secured');

  const /** @type AriaConfig */ ariaConfig =
    Object.assign({}, initialAriaConfig, customAriaConfig);

  console.log(
    '`enableWaiAria` ...',
    { compound, compoundData, ariaConfig, customAriaConfig },
  );
}
