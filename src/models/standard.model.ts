import pool from "../db/pool";
import {
  getCreateManyQuery,
  getCreateQuery,
  getSearchQuery,
  getUpdateQuery,
} from "../db/utils";
import QueryError from "../modules/QueryError";
import Model from "../types/Model";
import { Schema, StringifiedKeys, getAllFields } from "../types/utils";

type StandardModel<T extends Model, Z extends string> = {
  [key in `getAll${Z}s`]: () => Promise<T[]>;
} & {
  [key in `get${Z}sByQuery`]: (
    query: Partial<T> | StringifiedKeys<Partial<T>>
  ) => Promise<T[]>;
} & {
  [key in `get${Z}ById`]: (id: T["id"]) => Promise<T>;
} & {
  [key in `create${Z}`]: (newItem: Omit<T, "id">) => Promise<T>;
} & {
  [key in `create${Z}s`]: (newItems: Omit<T, "id">[]) => Promise<T[]>;
} & {
  [key in `replace${Z}ById`]: (
    id: T["id"],
    updatedItem: Omit<T, "id">
  ) => Promise<T>;
} & {
  [key in `patch${Z}ById`]: (
    id: T["id"],
    updatedItem: Partial<Omit<T, "id">>
  ) => Promise<T>;
} & {
  [key in `delete${Z}ById`]: (id: T["id"]) => Promise<T>;
};

const createStandardModel = <T extends Model, Z extends string>(
  tableName: Z,
  newItemSchema: Schema<Omit<T, "id">>
): StandardModel<T, Z> => {
  return {
    async [`getAll${tableName}s`](): Promise<T[]> {
      const items = await pool.query<T>(`SELECT * FROM "${tableName}"`);
      return items.rows;
    },

    async [`get${tableName}sByQuery`](
      query: Partial<T> | StringifiedKeys<Partial<T>>
    ): Promise<T[]> {
      const { queryString, values } = getSearchQuery(tableName, query);
      const items = await pool.query<T>(queryString, values);
      return items.rows;
    },

    async [`get${tableName}ById`](id: T["id"]): Promise<T> {
      const { queryString, values } = getSearchQuery(tableName, { id });
      const item = await pool.query<T>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`create${tableName}`](newItem: Omit<T, "id">): Promise<T> {
      const { queryString, values } = getCreateQuery(tableName, newItem);
      const item = await pool.query<T>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`create${tableName}s`](newItems: Omit<T, "id">[]): Promise<T[]> {
      const { queryString, values } = getCreateManyQuery(tableName, newItems);
      const items = await pool.query<T>(queryString, values);
      if (items.rows.length === 0) throw new QueryError(["No rows returned"]);
      return items.rows;
    },

    async [`replace${tableName}ById`](
      id: T["id"],
      updatedItem: Omit<T, "id">
    ): Promise<T> {
      const itemWithAllFields = getAllFields(updatedItem, newItemSchema);
      const { queryString, values } = getUpdateQuery(
        tableName,
        itemWithAllFields,
        id
      );
      const item = await pool.query<T>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`patch${tableName}ById`](
      id: T["id"],
      updatedSchedule: Partial<T>
    ): Promise<T> {
      const { queryString, values } = getUpdateQuery(
        tableName,
        updatedSchedule,
        id
      );
      const item = await pool.query<T>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);

      return item.rows[0];
    },

    async [`delete${tableName}ById`](id: T["id"]): Promise<T> {
      const queryString = `DELETE FROM "${tableName}" WHERE id = $1 RETURNING *`;
      const values = [id];
      const employee = await pool.query<T>(queryString, values);
      if (employee.rows.length === 0)
        throw new QueryError(["No rows returned"]);
      return employee.rows[0];
    },
  } as StandardModel<T, Z>;
};

export default createStandardModel;
