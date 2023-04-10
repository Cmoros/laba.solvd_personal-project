import Model, { ModelId, getModelId } from "../types/Model";
import { StringifiedKeys, TypesFromDB } from "../types/utils";

// FIXME Remove "as" used to cast to TypesFromDB

export type DBRow = Record<string, TypesFromDB>;

/*
const getCopyWithoutId = <T extends string, M extends Model<T>>(
  tableName: T,
  toCreate: M
) => {
  const copyWithoutId: M & { [key in ModelId<T>]?: number } = {
    ...toCreate,
    [getModelId(tableName)]: -1,
  };
  delete copyWithoutId[getModelId(tableName)];
  return copyWithoutId as Omit<Model<T>, ModelId<T>>;
};
*/

// This query search only for exact matches
// It can be improved to handle partial matches with texts(with a little of work)
// It could be a requirement or not in the future
export const getSearchQuery = <T extends string, M extends Model<T>>(
  tableName: T,
  query: Partial<M> | StringifiedKeys<Partial<M>>
) => {
  let queryString = `SELECT * FROM "${tableName}" WHERE `;
  const values: TypesFromDB[] = [];
  for (const key in query) {
    queryString += `"${key}" = $${values.length + 1} AND `;
    values.push((query[key as keyof M] as TypesFromDB) ?? null);
  }
  queryString = queryString.slice(0, -5);
  return { queryString, values };
};

const getValuesQuery = <T extends string, M extends Omit<Model<T>, ModelId<T>>>(
  toCreate: M,
  currentValues = 0
) => {
  let valuesString = "";
  const values: TypesFromDB[] = [];
  for (const key in toCreate) {
    valuesString += `$${values.length + 1 + currentValues}, `;
    values.push((toCreate[key as keyof M] as TypesFromDB) ?? null);
  }
  valuesString = valuesString.slice(0, -2);
  return { valuesString, values };
};

export const getCreateQuery = <
  T extends string,
  M extends Omit<Model<T>, ModelId<T>>
>(
  tableName: T,
  toCreate: M
) => {
  let initialQueryString = `INSERT INTO "${tableName}" (`;
  const copyWithoutId: M & { [key in ModelId<T>]?: number } = {
    ...toCreate,
    [getModelId(tableName)]: -1,
  };
  delete copyWithoutId[getModelId(tableName)];
  for (const key in copyWithoutId) {
    initialQueryString += `"${key}", `;
  }
  initialQueryString = initialQueryString.slice(0, -2);
  const { valuesString, values } = getValuesQuery(copyWithoutId);

  return {
    queryString:
      initialQueryString + ") VALUES (" + valuesString + ") RETURNING *",
    values,
  };
};

// This function requires that all objects in the array have the same fields
// It can be improved to handle different fields or it can be a requirement for using the utility function
// Not decided yet because it haven't been implemented in the code
export const getCreateManyQuery = <
  T extends string,
  M extends Omit<Model<T>, ModelId<T>>
>(
  tableName: T,
  toCreate: M[]
) => {
  const copiesWithoutId = toCreate.map((row) => {
    const copyWithoutId: M & { [key in ModelId<T>]?: number } = {
      ...row,
      [getModelId(tableName)]: -1,
    };
    delete copyWithoutId[getModelId(tableName)];
    return copyWithoutId;
  });
  let initialQueryString = `INSERT INTO "${tableName}" (`;
  for (const key in copiesWithoutId[0]) {
    initialQueryString += `"${key}", `;
  }
  initialQueryString = initialQueryString.slice(0, -2);
  let valuesString = "";

  const values: (string | number | null)[] = [];
  for (const row of copiesWithoutId) {
    valuesString += "(";
    const { valuesString: rowValuesString, values: rowValues } = getValuesQuery(
      row,
      values.length
    );
    valuesString += rowValuesString + "), ";
    values.push(...rowValues);
  }
  valuesString = valuesString.slice(0, -2);
  return {
    queryString:
      initialQueryString + ") VALUES " + valuesString + " RETURNING *",
    values,
  };
};

export const getUpdateQuery = <
  T extends string,
  M extends
    | Omit<Model<T>, `${Uncapitalize<T>}Id`>
    | Partial<Omit<Model<T>, `${Uncapitalize<T>}Id`>>
>(
  tableName: T,
  toUpdate: M,
  id: number | string
) => {
  const itemId = getModelId(tableName);
  const copyWithoutId: M & { [key in ModelId<T>]?: number } = {
    ...toUpdate,
    [itemId]: -1,
  };
  delete copyWithoutId[itemId];
  let queryString = `UPDATE "${tableName}" SET `;
  const values: TypesFromDB[] = [];
  for (const key in copyWithoutId) {
    queryString += `"${key}" = $${values.length + 1}, `;
    values.push((copyWithoutId[key as keyof M] as TypesFromDB) ?? null);
  }
  queryString = queryString.slice(0, -2);
  queryString += ` WHERE "${itemId}" = $${values.length + 1} RETURNING *`;
  values.push(id);
  return { queryString, values };
};
