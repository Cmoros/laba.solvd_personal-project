import { NextFunction, Response } from "express";
import {
  createTrain,
  deleteTrainById,
  getAllTrains,
  getTrainById,
  getTrainsByQuery,
  patchTrainById,
  replaceTrainById,
} from "../models/train.model";
import { AuthorizedRequest } from "../types/CustomRequest";
import Train, { NewTrain } from "../types/Train";
import { EmptyObject, checkIsEmptyObject } from "../types/utils";
import { QueryParams } from "../types/Auth";
import { handleQueryError, handleSuccessfulQuery } from "./utils";

// TODO Old unused code, delete later

export const getTrains = async (
  req: AuthorizedRequest<EmptyObject, EmptyObject, QueryParams<Train>>,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  let trains: Train[];
  try {
    if (checkIsEmptyObject(query)) {
      trains = await getAllTrains();
    } else {
      trains = await getTrainsByQuery(query);
    }
    handleSuccessfulQuery(res, trains);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const getTrain = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const train = await getTrainById(+id);
    handleSuccessfulQuery(res, train);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const postTrain = async (
  req: AuthorizedRequest<Record<string, never>, NewTrain>,
  res: Response,
  next: NextFunction
) => {
  const newTrain = req.body;
  try {
    const createdTrain = await createTrain(newTrain);
    handleSuccessfulQuery(res, createdTrain, 201);
  } catch (error) {
    handleQueryError(error, "Not created", next);
  }
};

export const putTrain = async (
  req: AuthorizedRequest<{ id: string }, NewTrain>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newTrain = req.body;
  try {
    const replacedTrain = await replaceTrainById(+id, newTrain);
    handleSuccessfulQuery(res, replacedTrain);
  } catch (error) {
    handleQueryError(error, "Not updated", next);
  }
};

export const patchTrain = async (
  req: AuthorizedRequest<{ id: string }, Partial<NewTrain>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const partialTrain = req.body;
  try {
    const patchedTrain = await patchTrainById(+id, partialTrain);
    handleSuccessfulQuery(res, patchedTrain);
  } catch (error) {
    handleQueryError(error, "Not patched", next);
  }
};

export const deleteTrain = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await deleteTrainById(+id);
    res.status(204).end();
  } catch (error) {
    handleQueryError(error, "Not deleted", next);
  }
};
