import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export type TrainTableName = "Train";

export const TRAIN_TABLE_NAME: TrainTableName = "Train";

export default interface Train extends Model<TrainTableName> {
  model?: string | null;
  lineId: number;
  totalCars: number;
  capacityPerCar: number;
}

export type NewTrain = Omit<Train, `${Uncapitalize<TrainTableName>}Id`>;

export type StringifiedTrain = StringifiedKeys<Train>;

export type QueryTrain = Partial<StringifiedTrain | Train>;

export const newTrainSchema: Schema<NewTrain> = {
  model: { type: "string", required: false },
  lineId: { type: "number", required: true },
  totalCars: { type: "number", required: true },
  capacityPerCar: { type: "number", required: true },
};

export const trainSchema: Schema<Train> = {
  ...newTrainSchema,
  trainId: { type: "number", required: true },
};
