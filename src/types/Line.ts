import { Schema, StringifiedKeys } from "./utils";

export default interface Line {
  id: number;
  name: string;
}

export type NewLine = Omit<Line, "id">;

export type StringifiedLine = StringifiedKeys<Line>;

export type QueryLine = Partial<StringifiedLine | Line>;

// export const lineOptionalFields: OptionalKeys<Line>[] = [];

// export const lineRequiredFields: RequiredKeys<Line>[] = ["id", "name"];

export const newLineSchema: Schema<NewLine> = {
  name: { type: "string", required: true },
};

export const lineSchema: Schema<Line> = {
  ...newLineSchema,
  id: { type: "number", required: true },
};
