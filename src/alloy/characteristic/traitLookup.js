import { withFetching } from "./trait/fetching";
import { withRoutes } from "./trait/routed";

export default Object.freeze({
  fetching: withFetching,
  routed: withRoutes,
});
