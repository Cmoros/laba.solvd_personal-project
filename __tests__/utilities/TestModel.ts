import Model, { ModelId } from "../../src/types/Model";
import { Schema, StringifiedKeys } from "../../src/types/utils";

export type TestTableName = "Test";

export const TEST_TABLE_NAME: TestTableName = "Test";

export default interface TestModel extends Model<TestTableName> {
  name: string;
  number?: number;
  description?: string;
}

export type NewTestModel = Omit<TestModel, ModelId<TestTableName>>;
export type StringifiedTestModel = StringifiedKeys<TestModel>;

export type QueryTestModel = Partial<StringifiedTestModel | TestModel>;

export const newTestModelSchema: Schema<NewTestModel> = {
  name: { type: "string", required: true },
  number: { type: "number", required: false },
  description: { type: "string", required: false },
};

export const lineSchema: Schema<TestModel> = {
  ...newTestModelSchema,
  testId: { type: "number", required: true },
};
