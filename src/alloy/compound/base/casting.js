import { isFunction } from '../../../utility/type-detection';

import initialTraitLookup from '../../characteristic/traitLookup';

import { compoundDataRegistry } from './alloy';


export const traitRegistry = new WeakMap;


/**
 * @param {string} traitName
 * @param {ApplicapleType} trait
 * @param {Microstructure} compound
 */
function applyTrait(traitName, trait, compound) {
  if (isFunction(trait)) {
    const dataMap = compoundDataRegistry.get(compound);

    const /** @type MicrostructureData */ rawCompoundData = dataMap.get('raw');
    const /** @type CompoundData */ compoundData = dataMap.get('secured');

    if (!traitRegistry.has(compound)) {

      traitRegistry.set(compound, new Map);
    }
    /** @type Map<Microstructure, Map<string, ApplicapleType>> */
    const traitMap = traitRegistry.get(compound);

    if (!traitMap.has(traitName)) {
      traitMap.set(traitName, trait);

      rawCompoundData.appliedTraits.set(traitName, trait);

      trait.call(compound, compoundData);
    }
  }
}

/**
 * @param {Microstructure} compound
 * @param {TraitLookup} [customTraitLookup]
 */
export function acquireTraits(compound, customTraitLookup) {
  const uniqueTraitNames = new Set(
    (compound.getAttribute('traits') ?? '')
      .trim()
      .split(/\s+/)
      .filter(traitName => !!traitName),
  );
  const /** @type TraitLookup */ traitLookup =
    Object.assign({}, initialTraitLookup, customTraitLookup);

  Object
    .entries(traitLookup)
    .forEach(([traitName, /** @type ApplicapleType */ trait]) => {

      if (uniqueTraitNames.has(traitName)) {

        applyTrait(traitName, trait, compound);
      }
    });

  return traitRegistry.get(compound) ?? new Set;
}
