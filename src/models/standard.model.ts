import pool from "../db/pool";
import {
  getCreateManyQuery,
  getCreateQuery,
  getSearchQuery,
  getUpdateQuery,
} from "../db/utils";
import QueryError from "../modules/QueryError";
import Model, { ModelId, getModelId } from "../types/Model";
import { Schema, StringifiedKeys, getAllFields } from "../types/utils";
import { capitalize } from "../utils";

type StandardModel<T extends string, M extends Model<T>> = {
  [key in `getAll${Capitalize<T>}s`]: () => Promise<M[]>;
} & {
  [key in `get${Capitalize<T>}sByQuery`]: (
    query: Partial<M> | StringifiedKeys<Partial<M>>
  ) => Promise<M[]>;
} & {
  [key in `get${Capitalize<T>}ById`]: (id: M[ModelId<T>]) => Promise<M>;
} & {
  [key in `create${Capitalize<T>}`]: (
    newItem: Omit<M, ModelId<T>>
  ) => Promise<M>;
} & {
  [key in `create${Capitalize<T>}s`]: (
    newItems: Omit<M, ModelId<T>>[]
  ) => Promise<M[]>;
} & {
  [key in `replace${Capitalize<T>}ById`]: (
    id: M[ModelId<T>],
    updatedItem: Omit<M, ModelId<T>>
  ) => Promise<M>;
} & {
  [key in `patch${Capitalize<T>}ById`]: (
    id: M[ModelId<T>],
    updatedItem: Partial<Omit<M, ModelId<T>>>
  ) => Promise<M>;
} & {
  [key in `delete${Capitalize<T>}ById`]: (id: M[ModelId<T>]) => Promise<M>;
};

const createStandardModel = <T extends string, M extends Model<T>>(
  tableName: T,
  newItemSchema: Schema<Omit<M, ModelId<T>>>
): StandardModel<T, M> => {
  return {
    async [`getAll${capitalize(tableName)}s`](): Promise<M[]> {
      const items = await pool.query<M>(`SELECT * FROM "${tableName}"`);
      return items.rows;
    },

    async [`get${capitalize(tableName)}sByQuery`](
      query: Partial<M> | StringifiedKeys<Partial<M>>
    ): Promise<M[]> {
      const { queryString, values } = getSearchQuery(tableName, query);
      const items = await pool.query<M>(queryString, values);
      return items.rows;
    },

    async [`get${capitalize(tableName)}ById`](id: M[ModelId<T>]): Promise<M> {
      const { queryString, values } = getSearchQuery(tableName, {
        [getModelId(tableName)]: id,
      } as Partial<M>);
      const item = await pool.query<M>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`create${capitalize(tableName)}`](
      newItem: Omit<M, "id">
    ): Promise<M> {
      const { queryString, values } = getCreateQuery(tableName, newItem);
      const item = await pool.query<M>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`create${capitalize(tableName)}s`](
      newItems: Omit<M, "id">[]
    ): Promise<M[]> {
      const { queryString, values } = getCreateManyQuery(tableName, newItems);
      const items = await pool.query<M>(queryString, values);
      if (items.rows.length === 0) throw new QueryError(["No rows returned"]);
      return items.rows;
    },

    async [`replace${capitalize(tableName)}ById`](
      id: M[ModelId<T>],
      updatedItem: Omit<M, ModelId<T>>
    ): Promise<M> {
      const itemWithAllFields = getAllFields(updatedItem, newItemSchema);
      const { queryString, values } = getUpdateQuery(
        tableName,
        itemWithAllFields,
        id
      );
      const item = await pool.query<M>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);
      return item.rows[0];
    },

    async [`patch${capitalize(tableName)}ById`](
      id: M[ModelId<T>],
      updatedSchedule: Partial<M>
    ): Promise<M> {
      const { queryString, values } = getUpdateQuery(
        tableName,
        updatedSchedule,
        id
      );
      const item = await pool.query<M>(queryString, values);
      if (item.rows.length === 0) throw new QueryError(["No rows returned"]);

      return item.rows[0];
    },

    async [`delete${capitalize(tableName)}ById`](
      id: M[ModelId<T>]
    ): Promise<M> {
      const queryString = `DELETE FROM "${tableName}" WHERE "${getModelId(
        tableName
      )}" = $1 RETURNING *`;
      const values = [id];
      const employee = await pool.query<M>(queryString, values);
      if (employee.rows.length === 0)
        throw new QueryError(["No rows returned"]);
      return employee.rows[0];
    },
  } as StandardModel<T, M>;
};

export default createStandardModel;
