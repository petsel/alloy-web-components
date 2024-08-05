import { isFunction } from '../../../utility/type-detection';

import initialTraitLookup from '../../characteristic/traitLookup';

const traitRegistry = new WeakMap();

function applyTrait(compound, compoundState, trait) {
  if (isFunction(trait)) {
    if (!traitRegistry.has(compound)) {
      traitRegistry.set(compound, new Set());
    }
    const traitIndex = traitRegistry.get(compound);

    if (!traitIndex.has(trait)) {
      traitIndex.add(trait);

      trait.call(compound, compoundState);
    }
  }
}

function acquireTraits(compoundState, customTraitLookup) {
  const compound = this;

  const uniqueTraitNames = new Set(
    (compound.getAttribute('traits') ?? '')
      .trim()
      .split(/\s+/)
      .filter((traitName) => !!traitName)
  );
  const traitLookup = Object.assign({}, initialTraitLookup, customTraitLookup);

  [...uniqueTraitNames.values()].forEach((traitName) =>
    applyTrait(compound, compoundState, traitLookup[traitName])
  );

  return traitRegistry.get(compound);
}

export function withAcquireTraits(compoundState) {
  const compound = this;

  Reflect.defineProperty(compound, 'acquireTraits', {
    configurable: true,
    writable: true,
    value: acquireTraits.bind(compound, compoundState || null),
  });
}
