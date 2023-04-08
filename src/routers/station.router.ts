/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  getStations,
  getStation,
  patchStation,
  putStation,
  deleteStation,
  postStation,
} from "../controllers/station.controller";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";
import { newStationSchema } from "../types/Station";

const stationsRouter = express.Router();
const validateFullBody = fullBodyValidation(newStationSchema);
const validatePartialBody = partialBodyValidation(newStationSchema);
const validateQueryParams = queryParamsValidation(newStationSchema);

stationsRouter.get(
  "",
  validateQueryParams,
  respondValidationError,
  getStations
);

stationsRouter.get(
  "/:id",
  idParamValidation,
  respondValidationError,
  getStation
);

stationsRouter.post("", validateFullBody, respondValidationError, postStation);

stationsRouter.put(
  "/:id",
  idParamValidation,
  validateFullBody,
  respondValidationError,
  putStation
);

stationsRouter.patch(
  "/:id",
  idParamValidation,
  validatePartialBody,
  respondValidationError,
  patchStation
);

stationsRouter.delete(
  "/:id",
  idParamValidation,
  respondValidationError,
  deleteStation
);

export default stationsRouter;
