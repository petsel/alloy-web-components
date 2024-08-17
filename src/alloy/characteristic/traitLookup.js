import { withFetch } from "./trait/fetches";
import { withTriggers } from "./trait/triggers";
import { withPaths } from "./trait/routed";

const /** @type TraitLookup */ initialTraitLookup = {
  fetches: withFetch,
  triggers: withTriggers,
  routed: withPaths,
}; 
export default Object.freeze(initialTraitLookup);
