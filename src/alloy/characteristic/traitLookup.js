import { withFetching } from './trait/fetching';
import { withRouting } from './trait/routed';

const /** @type TraitLookup */ initialTraitLookup = {
  fetching: withFetching,
  routed: withRouting,
}; 
export default Object.freeze(initialTraitLookup);
