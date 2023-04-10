import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export type ScheduleTableName = "Schedule";

export const SCHEDULE_TABLE_NAME: ScheduleTableName = "Schedule";

export default interface Schedule extends Model<ScheduleTableName> {
  startTime: string;
  endTime: string;
  startStationId: number;
  endStationId: number;
}

export type NewSchedule = Omit<
  Schedule,
  `${Uncapitalize<ScheduleTableName>}Id`
>;

export type StringifiedSchedule = StringifiedKeys<Schedule>;

export type QuerySchedule = Partial<StringifiedSchedule | Schedule>;

export const newScheduleSchema: Schema<NewSchedule> = {
  startTime: { type: "string", required: true },
  endTime: { type: "string", required: true },
  startStationId: { type: "number", required: true },
  endStationId: { type: "number", required: true },
};

export const scheduleSchema: Schema<Schedule> = {
  ...newScheduleSchema,
  scheduleId: { type: "number", required: true },
};
