import { withFetching } from './trait/fetching';
import { withRoutes } from './trait/routed';

const /** @type TraitLookup */ initialTraitLookup = {
  fetching: withFetching,
  routed: withRoutes,
}; 
export default Object.freeze(initialTraitLookup);
