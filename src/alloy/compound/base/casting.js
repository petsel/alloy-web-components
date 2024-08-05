import { isFunction } from '../../../utility/type-detection';

import initialTraitLookup from '../../characteristic/traitLookup';


const traitRegistry = new WeakMap;

/**
 * @param {Microstructure} compound
 * @param {DataObject} compoundState
 * @param {ElementInternals} elementInternals
 * @param {ApplicapleType} trait
 */
function applyTrait(compound, compoundState, elementInternals, trait) {
  if (isFunction(trait)) {
    if (!traitRegistry.has(compound)) {
      traitRegistry.set(compound, new Set);
    }
    const /** @type TraitIndex */ traitIndex = traitRegistry.get(compound);

    if (!traitIndex.has(trait)) {
      traitIndex.add(trait);

      trait.call(compound, compoundState, elementInternals);
    }
  }
}

/**
 * @param {Microstructure} compound
 * @param {DataObject} compoundState
 * @param {ElementInternals} elementInternals
 * @param {TraitLookup} customTraitLookup
 * @returns {Set<ApplicapleType>}
 */
export function acquireTraits(
  compound, compoundState, elementInternals, customTraitLookup,
) {
  const uniqueTraitNames = new Set(
    (compound.getAttribute('traits') ?? '')
      .trim()
      .split(/\s+/)
      .filter((traitName) => !!traitName)
  );
  const traitLookup = Object.assign({}, initialTraitLookup, customTraitLookup);

  [...uniqueTraitNames.values()].forEach((traitName) =>
    applyTrait(compound, compoundState, elementInternals, traitLookup[traitName])
  );

  return traitRegistry.get(compound) ?? new Set;
}
