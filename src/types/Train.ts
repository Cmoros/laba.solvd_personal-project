import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export default interface Train extends Model {
  model: string;
  lineId: number;
  totalCars: number;
  capacityPerCar: number;
}

export type NewTrain = Omit<Train, "id">;

export type StringifiedTrain = StringifiedKeys<Train>;

export type QueryTrain = Partial<StringifiedTrain | Train>;

export const newTrainSchema: Schema<NewTrain> = {
  model: { type: "string", required: false },
  lineId: { type: "number", required: true },
  totalCars: { type: "number", required: true },
  capacityPerCar: { type: "number", required: true },
};

export const lineSchema: Schema<Train> = {
  ...newTrainSchema,
  id: { type: "number", required: true },
};
