import { BaseAlloy as Microstructure } from "./alloy/compound/base/alloy";


function handleSubClassInstantiationDynamically(BaseClass,/* target, args, newTarget */...args) {
  const target = args.at(0);
  Object.setPrototypeOf(target, BaseClass);

  debugger;

  const instance = Reflect.construct(/* target, args, newTarget */...args);
  // const instance = new Microstructure;

  Object.setPrototypeOf(target, HTMLElement);
  return instance;
}
function createSubClassProxy(BaseClass) {
  return new Proxy(Microstructure, {
    construct: handleSubClassInstantiationDynamically.bind(null, BaseClass),
  });
}

function getPropertyObserver(target, key, proxy) {
  if (target !== Microstructure) {
    throw new ReferenceError(
      `Access denied. '${ target.name }' is of unknown origing. Accessing of specific \`BaseAlloy\` properties can not be spoofed.`,
    );
  }
  return (key === 'from')
    && createSubClassProxy
    || Reflect.get(target, key, proxy);
}

function invocationObserver(target/*, context, args */) {
  throw new TypeError(
    `Failed to construct '${ target.name }'. Please use the \`new\` operator. A custom-element constructor can not be invoked like any other function.`,
  );
}

function instantiationObserver(target, args, proxy) {
  if (target !== Microstructure) {
    throw new TypeError(
      `Failed to construct '${ target.name }'. The instantiation process of the \`BaseAlloy\` class can not be spoofed.`,
    );
  }
  return Reflect.construct(Microstructure, args, proxy);
  // return new Microstructure(...args);
}


export const /** @type Microstructure */ BaseAlloy =
  new Proxy(Microstructure, {
    get: getPropertyObserver,
    apply: invocationObserver,
    construct: instantiationObserver,
  });
