import Model from "../../src/types/Model";
import { Schema, StringifiedKeys } from "../../src/types/utils";

export default interface TestModel extends Model {
  name: string;
  number?: number;
  description?: string;
}

export type NewTestModel = Omit<TestModel, "id">;

export type StringifiedTestModel = StringifiedKeys<TestModel>;

export type QueryTestModel = Partial<StringifiedTestModel | TestModel>;

export const newTestModelSchema: Schema<NewTestModel> = {
  name: { type: "string", required: true },
  number: { type: "number", required: false },
  description: { type: "string", required: false },
};

export const lineSchema: Schema<TestModel> = {
  ...newTestModelSchema,
  id: { type: "number", required: true },
};
