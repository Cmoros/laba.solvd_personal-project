import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export default interface RouteSegment extends Model {
  peopleFlow: number;
  cycleId: number;
  scheduleId: number;
}

export type NewRouteSegment = Omit<RouteSegment, "id">;

export type StringifiedRouteSegment = StringifiedKeys<RouteSegment>;

export type QueryRouteSegment = Partial<StringifiedRouteSegment | RouteSegment>;

export const newRouteSegmentSchema: Schema<NewRouteSegment> = {
  peopleFlow: { type: "number", required: true },
  cycleId: { type: "number", required: true },
  scheduleId: { type: "number", required: true },
};

export const lineSchema: Schema<RouteSegment> = {
  ...newRouteSegmentSchema,
  id: { type: "number", required: true },
};
