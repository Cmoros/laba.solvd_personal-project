import Model from "../types/Model";
import { StringifiedKeys, TypesFromDB } from "../types/utils";

// FIXME Remove "as" used to cast to TypesFromDB

export type DBRow = Record<string, TypesFromDB>;

// This query search only for exact matches
// It can be improved to handle partial matches with texts(with a little of work)
// It could be a requirement or not in the future
export const getSearchQuery = <
  T extends Partial<Model> | StringifiedKeys<Partial<Model>>
>(
  tableName: string,
  query: T
) => {
  let queryString = `SELECT * FROM "${tableName}" WHERE `;
  const values: TypesFromDB[] = [];
  for (const key in query) {
    queryString += `"${key}" = $${values.length + 1} AND `;
    values.push((query[key as keyof T] as TypesFromDB) ?? null);
  }
  queryString = queryString.slice(0, -5);
  return { queryString, values };
};

const getValuesQuery = <T extends Omit<Model, "id">>(
  toCreate: T,
  currentValues = 0
) => {
  let valuesString = "";
  const values: TypesFromDB[] = [];
  for (const key in toCreate) {
    valuesString += `$${values.length + 1 + currentValues}, `;
    values.push((toCreate[key as keyof T] as TypesFromDB) ?? null);
  }
  valuesString = valuesString.slice(0, -2);
  return { valuesString, values };
};

export const getCreateQuery = <T extends Omit<Model, "id">>(
  tableName: string,
  toCreate: T
) => {
  let initialQueryString = `INSERT INTO "${tableName}" (`;
  const copyWithoutId: T & { id?: number } = { ...toCreate, id: -1 };
  delete copyWithoutId.id;
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
export const getCreateManyQuery = <T extends Omit<Model, "id">>(
  tableName: string,
  toCreate: T[]
) => {
  let initialQueryString = `INSERT INTO "${tableName}" (`;
  for (const key in toCreate[0]) {
    initialQueryString += `"${key}", `;
  }
  initialQueryString = initialQueryString.slice(0, -2);
  let valuesString = "";

  const values: (string | number | null)[] = [];
  for (const row of toCreate) {
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
  T extends Omit<Model, "id"> | Partial<Omit<Model, "id">>
>(
  tableName: string,
  toUpdate: T,
  id: number | string
) => {
  let queryString = `UPDATE "${tableName}" SET `;
  const values: TypesFromDB[] = [];
  const copyWithoutId: T & { id?: number } = { ...toUpdate, id: -1 };
  for (const key in copyWithoutId) {
    if (key.toLowerCase() === "id") continue;
    queryString += `"${key}" = $${values.length + 1}, `;
    values.push((copyWithoutId[key as keyof T] as TypesFromDB) ?? null);
  }
  queryString = queryString.slice(0, -2);
  queryString += ` WHERE "id" = $${values.length + 1} RETURNING *`;
  values.push(id);
  return { queryString, values };
};
