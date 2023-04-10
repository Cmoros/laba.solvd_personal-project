import { uncapitalize } from "../utils";

/* eslint-disable @typescript-eslint/no-empty-interface */
export type ModelId<T extends string> = `${Uncapitalize<T>}Id`;

type Model<TableName extends string> = {
  [key in ModelId<TableName>]: number;
};

export const getModelId = <TableName extends string>(
  tableName: TableName
): ModelId<TableName> => {
  return `${uncapitalize(tableName)}Id`;
};

export default Model;
