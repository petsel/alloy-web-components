/*
function unifyStateKey(key) {
  return `internalState${key.replace(/^-{2}/, '__')}`;
}
const compundInternalsStatesRegistry = new WeakMap();

class InternalsStatesShim {
  #rootNode;
  #statesRegistry;

  constructor(rootNode) {
    compundInternalsStatesRegistry.set(
      (this.#rootNode = rootNode),
      (this.#statesRegistry = new Set())
    );
  }

  has(key) {
    return this.#statesRegistry.has(key);
  }
  add(key) {
    this.#statesRegistry.add(key);

    this.#rootNode.dataset[unifyStateKey(key)] = '';
  }
  delete(key) {
    this.#statesRegistry.delete(key);

    Reflect.deleteProperty(this.#rootNode.dataset, unifyStateKey(key));
  }
}
function createInternalsStates(rootNode) {
  return new InternalsStatesShim(rootNode);
}

class InternalsShim {
  #states;

  constructor(rootNode) {
    this.#states = new InternalsStatesShim(rootNode);
  }

  get states() {
    return this.#states;
  }
}
function createInternals(rootNode) {
  return new InternalsShim(rootNode);
}

function attachInternals() {
  const compound = this;
}
*/

/*
export function withElementInternalsSham() {
  const compound = this;

  // - e.g. Safari does not implement the
  //   custom-element `attachInternals` method.
  //
  // - 'attachInternals', in case of being
  //   implemented properly, is a prototype method.

  if (!('attachInternals' in compound)) {
    Reflect.defineProperty('attachInternals', {
      configurable: true,
      value: attachInternals,
    });
  }
  const internals = compound.attachInternals();

  // - e.g. Firefox does not implement the
  //   `states` property of attached internals.
  //
  // - 'states', in case of being implemented
  //    properly, is a prototype getter method.

  if (!('states' in internals)) {
    // Firefox does not implement the `states` property of attached internals.
    internals.states = createShimmedInternalsStates(this);
  }
  / * 
  internals ... ElementInternals {
    form: getter
    labels: getter
    role: null
    shadowRoot :#document-fragment
    states: CustomStateSet {size: 0}
    validationMessage: getter
    validity: getter
    willValidate: getter  
  }* /
}
*/
