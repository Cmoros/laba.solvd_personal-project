import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export default interface Cycle extends Model {
  lineId: number;
  trainId: number;
  totalFlow: number;
  driverId: number;
  scheduleId: number;
}

export type NewCycle = Omit<Cycle, "id">;

export type StringifiedCycle = StringifiedKeys<Cycle>;

export type QueryCycle = Partial<StringifiedCycle | Cycle>;

export const newCycleSchema: Schema<NewCycle> = {
  lineId: { type: "number", required: true },
  trainId: { type: "number", required: true },
  totalFlow: { type: "number", required: true },
  driverId: { type: "number", required: true },
  scheduleId: { type: "number", required: true },
};

export const lineSchema: Schema<Cycle> = {
  ...newCycleSchema,
  id: { type: "number", required: true },
};
