import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export default interface Schedule extends Model {
  startTime: string;
  endTime: string;
  startStationId: number;
  endStationId: number;
}

export type NewSchedule = Omit<Schedule, "id">;

export type StringifiedSchedule = StringifiedKeys<Schedule>;

export type QuerySchedule = Partial<StringifiedSchedule | Schedule>;

export const newScheduleSchema: Schema<NewSchedule> = {
  startTime: { type: "string", required: true },
  endTime: { type: "string", required: true },
  startStationId: { type: "number", required: true },
  endStationId: { type: "number", required: true },
};

export const lineSchema: Schema<Schedule> = {
  ...newScheduleSchema,
  id: { type: "number", required: true },
};
