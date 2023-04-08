/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  getLines,
  getLine,
  patchLine,
  putLine,
  deleteLine,
  postLine,
} from "../controllers/line.controller";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";
import { newLineSchema } from "../types/Line";

const linesRouter = express.Router();
const validateFullBody = fullBodyValidation(newLineSchema);
const validatePartialBody = partialBodyValidation(newLineSchema);
const validateQueryParams = queryParamsValidation(newLineSchema);

linesRouter.get("", validateQueryParams, respondValidationError, getLines);

linesRouter.get("/:id", idParamValidation, respondValidationError, getLine);

linesRouter.post("", validateFullBody, respondValidationError, postLine);

linesRouter.put(
  "/:id",
  idParamValidation,
  validateFullBody,
  respondValidationError,
  putLine
);

linesRouter.patch(
  "/:id",
  idParamValidation,
  validatePartialBody,
  respondValidationError,
  patchLine
);

linesRouter.delete(
  "/:id",
  idParamValidation,
  respondValidationError,
  deleteLine
);

export default linesRouter;
