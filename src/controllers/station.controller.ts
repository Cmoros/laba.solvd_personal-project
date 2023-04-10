import { NextFunction, Response } from "express";
import {
  createStation,
  deleteStationById,
  getAllStations,
  getStationById,
  getStationsByQuery,
  patchStationById,
  replaceStationById,
} from "../models/station.model";
import { AuthorizedRequest } from "../types/CustomRequest";
import Station, { NewStation } from "../types/Station";
import { EmptyObject, checkIsEmptyObject } from "../types/utils";
import { QueryParams } from "../types/Auth";
import { handleQueryError, handleSuccessfulQuery } from "./utils";

// TODO Old Code, delete later

export const getStations = async (
  req: AuthorizedRequest<EmptyObject, EmptyObject, QueryParams<Station>>,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  let stations: Station[];
  try {
    if (checkIsEmptyObject(query)) {
      stations = await getAllStations();
    } else {
      stations = await getStationsByQuery(query);
    }
    handleSuccessfulQuery(res, stations);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const getStation = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const station = await getStationById(+id);
    handleSuccessfulQuery(res, station);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const postStation = async (
  req: AuthorizedRequest<Record<string, never>, NewStation>,
  res: Response,
  next: NextFunction
) => {
  const newStation = req.body;
  try {
    const createdStation = await createStation(newStation);
    handleSuccessfulQuery(res, createdStation, 201);
  } catch (error) {
    handleQueryError(error, "Not created", next);
  }
};

export const putStation = async (
  req: AuthorizedRequest<{ id: string }, NewStation>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newStation = req.body;
  try {
    const replacedStation = await replaceStationById(+id, newStation);
    handleSuccessfulQuery(res, replacedStation);
  } catch (error) {
    handleQueryError(error, "Not updated", next);
  }
};

export const patchStation = async (
  req: AuthorizedRequest<{ id: string }, Partial<NewStation>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const partialStation = req.body;
  try {
    const patchedStation = await patchStationById(+id, partialStation);
    handleSuccessfulQuery(res, patchedStation);
  } catch (error) {
    handleQueryError(error, "Not patched", next);
  }
};

export const deleteStation = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await deleteStationById(+id);
    res.status(204).end();
  } catch (error) {
    handleQueryError(error, "Not deleted", next);
  }
};
