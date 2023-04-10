import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Schedule, {
  NewSchedule,
  QuerySchedule,
  newScheduleSchema,
} from "../types/Schedule";
import { getAllFields } from "../types/utils";

const TABLE_NAME = "Schedule";

export const getAllSchedules = async (): Promise<Schedule[]> => {
  const shcedules = await pool.query<Schedule>(`SELECT * FROM "${TABLE_NAME}"`);
  return shcedules.rows;
};

export const getSchedulesByQuery = async (
  query: QuerySchedule
): Promise<Schedule[]> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, query);
  const shcedules = await pool.query<Schedule>(queryString, values);
  return shcedules.rows;
};

export const getScheduleById = async (
  id: Schedule["id"]
): Promise<Schedule> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, { id });
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const createSchedule = async (
  newSchedule: NewSchedule
): Promise<Schedule> => {
  const { queryString, values } = getCreateQuery(TABLE_NAME, newSchedule);
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const replaceScheduleById = async (
  id: Schedule["id"],
  updatedSchedule: NewSchedule
): Promise<Schedule> => {
  const shceduleWithAllFields = getAllFields(
    updatedSchedule,
    newScheduleSchema
  );
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    shceduleWithAllFields,
    id
  );
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);
  return shcedule.rows[0];
};

export const patchScheduleById = async (
  id: Schedule["id"],
  updatedSchedule: Partial<NewSchedule>
): Promise<Schedule> => {
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    updatedSchedule,
    id
  );
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const deleteScheduleById = async (
  id: Schedule["id"]
): Promise<Schedule> => {
  const queryString = `DELETE FROM "${TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Schedule>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};
