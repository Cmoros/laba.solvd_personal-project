import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Line, {
  LINE_TABLE_NAME,
  LineTableName,
  NewLine,
  QueryLine,
  newLineSchema,
} from "../types/Line";
import { ModelId, getModelId } from "../types/Model";
import { getAllFields } from "../types/utils";

// TODO Old unused code, delete later

export const getAllLines = async (): Promise<Line[]> => {
  const lines = await pool.query<Line>(`SELECT * FROM "${LINE_TABLE_NAME}"`);
  return lines.rows;
};

export const getLinesByQuery = async (query: QueryLine): Promise<Line[]> => {
  const { queryString, values } = getSearchQuery(LINE_TABLE_NAME, query);
  const lines = await pool.query<Line>(queryString, values);
  return lines.rows;
};

export const getLineById = async (
  id: Line[ModelId<LineTableName>]
): Promise<Line> => {
  const { queryString, values } = getSearchQuery(LINE_TABLE_NAME, {
    [`${getModelId(LINE_TABLE_NAME)}`]: id,
  });
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const createLine = async (newLine: NewLine): Promise<Line> => {
  const { queryString, values } = getCreateQuery(LINE_TABLE_NAME, newLine);
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const replaceLineById = async (
  id: Line[ModelId<LineTableName>],
  updatedLine: NewLine
): Promise<Line> => {
  const lineWithAllFields = getAllFields(updatedLine, newLineSchema);
  const { queryString, values } = getUpdateQuery(
    LINE_TABLE_NAME,
    lineWithAllFields,
    id
  );
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);
  return line.rows[0];
};

export const patchLineById = async (
  id: Line[ModelId<LineTableName>],
  updatedLine: Partial<NewLine>
): Promise<Line> => {
  const { queryString, values } = getUpdateQuery(
    LINE_TABLE_NAME,
    updatedLine,
    id
  );
  const line = await pool.query<Line>(queryString, values);
  if (line.rows.length === 0) throw new QueryError(["No rows returned"]);

  return line.rows[0];
};

export const deleteLineById = async (
  id: Line[ModelId<LineTableName>]
): Promise<Line> => {
  const queryString = `DELETE FROM "${LINE_TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Line>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};
