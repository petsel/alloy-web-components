import { trusted as trustedEvent } from '../../compound/base/event';


const isValidCompoundLifeCycleEvent = trustedEvent.isValidLifeCycle;


/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withRoutes(compoundData) {
  const compound = this;

  // const { /* Event, CustomEvent, */ isValidLifeCycle: isValidCompoundLifeCycleEvent } = compoundData.trusted.event;

  compound.setAttribute('hidden', '');

  console.log('withRoutes');

  compound.addEventListener('compound-connected', evt => {
    if (isValidCompoundLifeCycleEvent(evt)) {

      console.log({ node: this, evt })
    }
  });
}