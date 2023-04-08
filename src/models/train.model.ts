import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Train, { NewTrain, QueryTrain, newTrainSchema } from "../types/Train";
import { getAllFields } from "../types/utils";

const TABLE_NAME = "Train";

export const getAllTrains = async (): Promise<Train[]> => {
  const trains = await pool.query<Train>(`SELECT * FROM "${TABLE_NAME}"`);
  return trains.rows;
};

export const getTrainsByQuery = async (query: QueryTrain): Promise<Train[]> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, query);
  const trains = await pool.query<Train>(queryString, values);
  return trains.rows;
};

export const getTrainById = async (id: Train["id"]): Promise<Train> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, { id });
  const train = await pool.query<Train>(queryString, values);
  if (train.rows.length === 0) throw new QueryError(["No rows returned"]);

  return train.rows[0];
};

export const createTrain = async (newTrain: NewTrain): Promise<Train> => {
  const { queryString, values } = getCreateQuery(TABLE_NAME, newTrain);
  const train = await pool.query<Train>(queryString, values);
  if (train.rows.length === 0) throw new QueryError(["No rows returned"]);

  return train.rows[0];
};

export const replaceTrainById = async (
  id: Train["id"],
  updatedTrain: NewTrain
): Promise<Train> => {
  const trainWithAllFields = getAllFields(updatedTrain, newTrainSchema);
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    trainWithAllFields,
    id
  );
  const train = await pool.query<Train>(queryString, values);
  if (train.rows.length === 0) throw new QueryError(["No rows returned"]);
  return train.rows[0];
};

export const patchTrainById = async (
  id: Train["id"],
  updatedTrain: Partial<NewTrain>
): Promise<Train> => {
  const { queryString, values } = getUpdateQuery(TABLE_NAME, updatedTrain, id);
  const train = await pool.query<Train>(queryString, values);
  if (train.rows.length === 0) throw new QueryError(["No rows returned"]);

  return train.rows[0];
};

export const deleteTrainById = async (id: Train["id"]): Promise<Train> => {
  const queryString = `DELETE FROM "${TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const train = await pool.query<Train>(queryString, values);
  if (train.rows.length === 0) throw new QueryError(["No rows returned"]);
  return train.rows[0];
};
