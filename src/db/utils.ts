import { TypesFromDB } from "../types/utils";

type DBRow = Record<string, TypesFromDB>;

export const getUpdateQuery = <T extends DBRow>(
  tableName: string,
  toUpdate: T,
  id: number
) => {
  let queryString = `UPDATE "${tableName}" SET `;
  const values: (string | number | null)[] = [];
  for (const key in toUpdate) {
    if (key.toLowerCase() === "id") continue;
    queryString += `"${key}" = $${values.length + 1}, `;
    values.push(toUpdate[key as keyof T] ?? null);
  }
  queryString = queryString.slice(0, -2);
  queryString += ` WHERE id = $${values.length + 1} RETURNING *`;
  values.push(id);
  return { queryString, values };
};

const getValuesQuery = <T extends DBRow>(toCreate: T, currentValues = 0) => {
  let valuesString = "";
  const values: (string | number | null)[] = [];
  for (const key in toCreate) {
    valuesString += `$${values.length + 1 + currentValues}, `;
    values.push(toCreate[key as keyof T] ?? null);
  }
  valuesString = valuesString.slice(0, -2);
  return { valuesString, values };
};

export const getCreateQuery = <T extends DBRow>(
  tableName: string,
  toCreate: T
) => {
  let initialQueryString = `INSERT INTO "${tableName}" (`;
  for (const key in toCreate) {
    initialQueryString += `"${key}", `;
  }
  initialQueryString = initialQueryString.slice(0, -2);
  const { valuesString, values } = getValuesQuery(toCreate);

  return {
    queryString:
      initialQueryString + ") VALUES (" + valuesString + ") RETURNING *",
    values,
  };
};

export const getCreateManyQuery = <T extends DBRow>(
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

export const getSearchQuery = <T extends DBRow>(
  tableName: string,
  query: T
) => {
  let queryString = `SELECT * FROM "${tableName}" WHERE `;
  const values: (string | number | null)[] = [];
  for (const key in query) {
    queryString += `"${key}" = $${values.length + 1} AND `;
    values.push(query[key as keyof T] ?? null);
  }
  queryString = queryString.slice(0, -5);
  return { queryString, values };
};
