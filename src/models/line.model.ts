import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Line, { NewLine, QueryLine, newLineSchema } from "../types/Line";
import { getAllFields } from "../types/utils";

const TABLE_NAME = "Line";

export const getAllLines = async (): Promise<Line[]> => {
  const lines = await pool.query<Line>(`SELECT * FROM "${TABLE_NAME}"`);
  return lines.rows;
};

export const getLinesByQuery = async (query: QueryLine): Promise<Line[]> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, query);
  const lines = await pool.query<Line>(queryString, values);
  return lines.rows;
};

export const getLineById = async (id: Line["id"]): Promise<Line> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, { id });
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const createLine = async (newLine: NewLine): Promise<Line> => {
  const { queryString, values } = getCreateQuery(TABLE_NAME, newLine);
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const replaceLineById = async (
  id: Line["id"],
  updatedLine: NewLine
): Promise<Line> => {
  const lineWithAllFields = getAllFields(updatedLine, newLineSchema);
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    lineWithAllFields,
    id
  );
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);
  return line.rows[0];
};

export const patchLineById = async (
  id: Line["id"],
  updatedLine: Partial<NewLine>
): Promise<Line> => {
  const { queryString, values } = getUpdateQuery(TABLE_NAME, updatedLine, id);
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const deleteLineById = async (id: Line["id"]): Promise<Line> => {
  const queryString = `DELETE FROM "${TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Line>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};
