export const initialAriaConfig = Object.freeze({
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
});

function enableWaiAria(/* compoundState, */ customAriaConfig) {
  const compound = this;

  const ariaConfig = Object.assign({}, initialAriaConfig, customAriaConfig);

  return compound.attachInternals?.() ?? null;
}

export function withEnableWaiAria(/* compoundState */) {
  const compound = this;

  Reflect.defineProperty(compound, 'enableWaiAria', {
    configurable: true,
    writable: true,
    value: enableWaiAria.bind(compound /*, compoundState || null */),
  });
}
