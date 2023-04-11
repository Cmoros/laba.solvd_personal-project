import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import { ModelId, getModelId } from "../types/Model";
import Station, {
  NewStation,
  QueryStation,
  StationTableName,
  newStationSchema,
} from "../types/Station";
import { getAllFields } from "../types/utils";

// TODO Old unused code, delete later

const TABLE_NAME = "Station";

export const getAllStations = async (): Promise<Station[]> => {
  const stations = await pool.query<Station>(`SELECT * FROM "${TABLE_NAME}"`);
  return stations.rows;
};

export const getStationsByQuery = async (
  query: QueryStation
): Promise<Station[]> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, query);
  const stations = await pool.query<Station>(queryString, values);
  return stations.rows;
};

export const getStationById = async (
  id: Station[ModelId<StationTableName>]
): Promise<Station> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, {
    [`${getModelId(TABLE_NAME)}`]: id,
  });
  const station = await pool.query<Station>(queryString, values);
  if (station.rows.length === 0) throw new QueryError(["No rows returned"]);

  return station.rows[0];
};

export const createStation = async (
  newStation: NewStation
): Promise<Station> => {
  const { queryString, values } = getCreateQuery(TABLE_NAME, newStation);
  const station = await pool.query<Station>(queryString, values);
  if (station.rows.length === 0) throw new QueryError(["No rows returned"]);

  return station.rows[0];
};

export const replaceStationById = async (
  id: Station[ModelId<StationTableName>],
  updatedStation: NewStation
): Promise<Station> => {
  const stationWithAllFields = getAllFields(updatedStation, newStationSchema);
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    stationWithAllFields,
    id
  );
  const station = await pool.query<Station>(queryString, values);
  if (station.rows.length === 0) throw new QueryError(["No rows returned"]);
  return station.rows[0];
};

export const patchStationById = async (
  id: Station[ModelId<StationTableName>],
  updatedStation: Partial<NewStation>
): Promise<Station> => {
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    updatedStation,
    id
  );
  const station = await pool.query<Station>(queryString, values);
  if (station.rows.length === 0) throw new QueryError(["No rows returned"]);

  return station.rows[0];
};

export const deleteStationById = async (
  id: Station[ModelId<StationTableName>]
): Promise<Station> => {
  const queryString = `DELETE FROM "${TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const station = await pool.query<Station>(queryString, values);
  if (station.rows.length === 0) throw new QueryError(["No rows returned"]);
  return station.rows[0];
};