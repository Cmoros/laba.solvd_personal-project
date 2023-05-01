import { newRouteSegmentSchema } from "../types/RouteSegment";
import createStandardRouter from "./standard.router";

const routeSegmentsRouter = createStandardRouter(
  "RouteSegment",
  newRouteSegmentSchema
);

export default routeSegmentsRouter;
