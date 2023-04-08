import { Schema, StringifiedKeys } from "./utils";

export default interface Station {
  id: number;
  name: string;
  location: string;
  lineId: number;
  number: number;
  capacity: number;
}

export type NewStation = Omit<Station, "id">;

export type StringifiedStation = StringifiedKeys<Station>;

export type QueryStation = Partial<StringifiedStation | Station>;

export const newStationSchema: Schema<NewStation> = {
  name: { type: "string", required: true },
  location: { type: "string", required: false },
  lineId: { type: "number", required: true },
  number: { type: "number", required: true },
  capacity: { type: "number", required: false },
};

export const lineSchema: Schema<Station> = {
  ...newStationSchema,
  id: { type: "number", required: true },
};
