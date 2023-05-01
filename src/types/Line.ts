import Model from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export type LineTableName = "Line";

export const LINE_TABLE_NAME: LineTableName = "Line";
export default interface Line extends Model<LineTableName> {
  name: string;
}

export type NewLine = Omit<Line, `${Uncapitalize<LineTableName>}Id`>;

export type StringifiedLine = StringifiedKeys<Line>;

export type QueryLine = Partial<StringifiedLine | Line>;

// export const lineOptionalFields: OptionalKeys<Line>[] = [];

// export const lineRequiredFields: RequiredKeys<Line>[] = ["id", "name"];

export const newLineSchema: Schema<NewLine> = {
  name: { type: "string", required: true },
};

export const lineSchema: Schema<Line> = {
  ...newLineSchema,
  lineId: { type: "number", required: true },
};
