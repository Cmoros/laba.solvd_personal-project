import Model, { ModelId } from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export type StationTableName = "Station";

export const STATION_TABLE_NAME: StationTableName = "Station";

export default interface Station extends Model<StationTableName> {
  name: string;
  location?: string | null;
  lineId: number;
  number: number;
  capacity: number;
}

export type NewStation = Omit<Station, ModelId<StationTableName>>;

export type StringifiedStation = StringifiedKeys<Station>;

export type QueryStation = Partial<StringifiedStation | Station>;

export const newStationSchema: Schema<NewStation> = {
  name: { type: "string", required: true },
  location: { type: "string", required: false },
  lineId: { type: "number", required: true },
  number: { type: "number", required: true },
  capacity: { type: "number", required: false },
};

export const stationSchema: Schema<Station> = {
  ...newStationSchema,
  stationId: { type: "number", required: true },
};
