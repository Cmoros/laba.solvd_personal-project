/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  getTrains,
  getTrain,
  patchTrain,
  putTrain,
  deleteTrain,
  postTrain,
} from "../controllers/train.controller";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";
import { newTrainSchema } from "../types/Train";

const trainsRouter = express.Router();
const validateFullBody = fullBodyValidation(newTrainSchema);
const validatePartialBody = partialBodyValidation(newTrainSchema);
const validateQueryParams = queryParamsValidation(newTrainSchema);

trainsRouter.get("", validateQueryParams, respondValidationError, getTrains);

trainsRouter.get("/:id", idParamValidation, respondValidationError, getTrain);

trainsRouter.post("", validateFullBody, respondValidationError, postTrain);

trainsRouter.put(
  "/:id",
  idParamValidation,
  validateFullBody,
  respondValidationError,
  putTrain
);

trainsRouter.patch(
  "/:id",
  idParamValidation,
  validatePartialBody,
  respondValidationError,
  patchTrain
);

trainsRouter.delete(
  "/:id",
  idParamValidation,
  respondValidationError,
  deleteTrain
);

export default trainsRouter;
