import { isFunction } from '../../../utility/type-detection';

import initialTraitLookup from '../../characteristic/traitLookup';


export const traitRegistry = new WeakMap;

/**
 * @param {ApplicapleType} trait
 * @param {Microstructure} compound
 * @param {CompoundData} compoundData
 */
function applyTrait(trait, compound, compoundData) {
  if (isFunction(trait)) {
    if (!traitRegistry.has(compound)) {
      traitRegistry.set(compound, new Set);
    }
    const /** @type TraitIndex */ traitIndex = traitRegistry.get(compound);

    if (!traitIndex.has(trait)) {
      traitIndex.add(trait);

      trait.call(compound, compoundData);
    }
  }
}

/**
 * @param {Microstructure} compound
 * @param {CompoundData} [compoundData={}]
 * @param {TraitLookup} [customTraitLookup]
 * @returns {TraitIndex}
 */
export function acquireTraits(compound, compoundData = {}, customTraitLookup) {
  const uniqueTraitNames = new Set(
    (compound.getAttribute('traits') ?? '')
      .trim()
      .split(/\s+/)
      .filter(traitName => !!traitName)
  );
  const traitLookup =
    Object.assign(Object.create(null), initialTraitLookup, customTraitLookup);

  [...uniqueTraitNames.values()]
    .forEach(traitName =>

      applyTrait(traitLookup[traitName], compound, compoundData)
    );

  return traitRegistry.get(compound) ?? new Set;
}
