import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import { SCHEDULE_TABLE_NAME, ScheduleTableName } from "../types/Schedule";
import { ModelId, getModelId } from "../types/Model";
import Schedule, {
  NewSchedule,
  QuerySchedule,
  newScheduleSchema,
} from "../types/Schedule";
import { getAllFields } from "../types/utils";

// TODO Old unused code, delete later

export const getAllSchedules = async (): Promise<Schedule[]> => {
  const shcedules = await pool.query<Schedule>(
    `SELECT * FROM "${SCHEDULE_TABLE_NAME}"`
  );
  return shcedules.rows;
};

export const getSchedulesByQuery = async (
  query: QuerySchedule
): Promise<Schedule[]> => {
  const { queryString, values } = getSearchQuery(SCHEDULE_TABLE_NAME, query);
  const shcedules = await pool.query<Schedule>(queryString, values);
  return shcedules.rows;
};

export const getScheduleById = async (
  id: Schedule[ModelId<ScheduleTableName>]
): Promise<Schedule> => {
  const { queryString, values } = getSearchQuery(SCHEDULE_TABLE_NAME, {
    [`${getModelId(SCHEDULE_TABLE_NAME)}`]: id,
  });
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const createSchedule = async (
  newSchedule: NewSchedule
): Promise<Schedule> => {
  const { queryString, values } = getCreateQuery(
    SCHEDULE_TABLE_NAME,
    newSchedule
  );
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const replaceScheduleById = async (
  id: Schedule[ModelId<ScheduleTableName>],
  updatedSchedule: NewSchedule
): Promise<Schedule> => {
  const shceduleWithAllFields = getAllFields(
    updatedSchedule,
    newScheduleSchema
  );
  const { queryString, values } = getUpdateQuery(
    SCHEDULE_TABLE_NAME,
    shceduleWithAllFields,
    id
  );
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);
  return shcedule.rows[0];
};

export const patchScheduleById = async (
  id: Schedule[ModelId<ScheduleTableName>],
  updatedSchedule: Partial<NewSchedule>
): Promise<Schedule> => {
  const { queryString, values } = getUpdateQuery(
    SCHEDULE_TABLE_NAME,
    updatedSchedule,
    id
  );
  const shcedule = await pool.query<Schedule>(queryString, values);
  if (shcedule.rows.length === 0) throw new QueryError(["No rows returned"]);

  return shcedule.rows[0];
};

export const deleteScheduleById = async (
  id: Schedule[ModelId<ScheduleTableName>]
): Promise<Schedule> => {
  const queryString = `DELETE FROM "${SCHEDULE_TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Schedule>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};
