import { isFunction, isHTMLElement } from "../utility/type-detection";
import { BaseAlloy as Microstructure } from "./compound/base/alloy";


function separateImpureMaterial(BaseAlloy, SuperElement) {
  if (!isFunction(SuperElement)) {
    console.error(
      new TypeError(
        'The type provided to `BaseAlloy.from` can not be invoked.',
       ),
    );
    SuperElement = BaseAlloy;
  }
  const superProbe = Object
    .getOwnPropertyDescriptor(SuperElement, 'prototype').value;

  if (!(superProbe instanceof HTMLElement) && !isHTMLElement(superProbe)) {
    console.error(
      new TypeError(
        'The type provided to `BaseAlloy.from` does not extend `HTMLElement`.',
       ),
    );
    SuperElement = BaseAlloy;
  }
  return SuperElement;
}
const transmutationRegistry = new Map;

function practiceTransmutation (BaseAlloy, SuperElement) {
  if (transmutationRegistry.has(SuperElement)) {
    return transmutationRegistry.get(SuperElement);
  }
  SuperElement = separateImpureMaterial(BaseAlloy, SuperElement);

  if (SuperElement === BaseAlloy) {
    return BaseAlloy;
  }/*
  const SuperProxy = new Proxy(SuperElement, {
    construct(connstructor, args, connstructorNew) {
      return Reflect.construct(connstructor, args, connstructorNew);
    }
  });*/
  const transmutation = new Proxy(BaseAlloy, {
    construct(Alloy, args, alloyProxy) {

      debugger;

      // create (base) `Alloy` instance
      const alloy = Reflect.construct(Alloy, args, alloyProxy);

      debugger;

      // create `SuperElement` instance
      const superElement = Reflect.construct(SuperElement, args, HTMLElement);
      // const superElement = Reflect.construct(SuperElement, args, SuperElement);

      debugger;

      // create an intermediary prototype-(chain)-object.
      const superAgens = Object.create(SuperElement.prototype);

      debugger;

      // assign `SuperElement`-instance properties to the `superAgens`-prototype.
      Object.assign(superAgens, superElement);

      debugger;

      // assign `Alloy.prototype` as the `superAgens`-prototype's prototype.
      Object.setPrototypeOf(superAgens, Alloy.prototype);

      debugger;

      // assign `superAgens`-prototype as `alloy`'s prototype.
      Object.setPrototypeOf(alloy, superAgens);

      debugger;

      return alloy;
    }
  });
  transmutationRegistry.set(SuperElement, transmutation);

  return transmutation;
}

function getPreparedForTransmutation(BaseAlloy, key, alloyProxy) {
  return (key === 'from')
    && practiceTransmutation.bind(null, BaseAlloy)
    || Reflect.get(BaseAlloy, key, alloyProxy);
}


export const /** @type Microstructure */ BaseAlloy =
  new Proxy(Microstructure, {
    get: getPreparedForTransmutation,
    // get: getPropertyObserver,
  });
