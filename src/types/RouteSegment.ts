import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

type RouteSegmentTableName = "RouteSegment";

export const ROUTE_SEGMENT_TABLE_NAME: RouteSegmentTableName = "RouteSegment";

export default interface RouteSegment extends Model<RouteSegmentTableName> {
  peopleFlow: number;
  cycleId: number;
  scheduleId: number;
}

export type NewRouteSegment = Omit<
  RouteSegment,
  `${Uncapitalize<RouteSegmentTableName>}Id`
>;

export type StringifiedRouteSegment = StringifiedKeys<RouteSegment>;

export type QueryRouteSegment = Partial<StringifiedRouteSegment | RouteSegment>;

export const newRouteSegmentSchema: Schema<NewRouteSegment> = {
  peopleFlow: { type: "number", required: true },
  cycleId: { type: "number", required: true },
  scheduleId: { type: "number", required: true },
};

export const routeSegmentSchema: Schema<RouteSegment> = {
  ...newRouteSegmentSchema,
  routeSegmentId: { type: "number", required: true },
};
