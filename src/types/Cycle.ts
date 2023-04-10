import Model, { ModelId } from "./Model";
import { Schema, StringifiedKeys } from "./utils";

type CycleTableName = "Cycle";

export const CYCLE_TABLE_NAME: CycleTableName = "Cycle";

export default interface Cycle extends Model<CycleTableName> {
  lineId: number;
  trainId: number;
  totalFlow: number;
  driverId: number;
  scheduleId: number;
}

export type NewCycle = Omit<Cycle, ModelId<CycleTableName>>;

export type StringifiedCycle = StringifiedKeys<Cycle>;

export type QueryCycle = Partial<StringifiedCycle | Cycle>;

export const newCycleSchema: Schema<NewCycle> = {
  lineId: { type: "number", required: true },
  trainId: { type: "number", required: true },
  totalFlow: { type: "number", required: true },
  driverId: { type: "number", required: true },
  scheduleId: { type: "number", required: true },
};

export const cycleSchema: Schema<Cycle> = {
  ...newCycleSchema,
  cycleId: { type: "number", required: true },
};
