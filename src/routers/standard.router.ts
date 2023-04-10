import { RequestHandler, Router } from "express";
import Model from "../types/Model";
import createStandardController from "../controllers/standard.controller";
import { Schema } from "../types/utils";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";

const createStandardRouter = <T extends Model, Z extends string>(
  tableName: Z,
  newItemSchema: Schema<Omit<T, "id">>,
  router = Router()
) => {
  // FIXME Remove Record<string, RequestHandler> and make it generic, somehow
  const standardController: Record<string, RequestHandler> =
    createStandardController(tableName, newItemSchema);
  const validateFullBody = fullBodyValidation(newItemSchema);
  const validatePartialBody = partialBodyValidation(newItemSchema);
  const validateQueryParams = queryParamsValidation(newItemSchema);
  router.get(
    "",
    validateQueryParams,
    respondValidationError,
    standardController[`get${tableName}s`]
  );

  router.get(
    "/:id",
    idParamValidation,
    respondValidationError,
    standardController[`get${tableName}`]
  );

  // TODO Add validation wether is array or not, for creating many
  router.post(
    "",
    validateFullBody,
    respondValidationError,
    standardController[`post${tableName}`]
  );

  router.put(
    "/:id",
    idParamValidation,
    validateFullBody,
    respondValidationError,
    standardController[`put${tableName}`]
  );

  router.patch(
    "/:id",
    idParamValidation,
    validatePartialBody,
    respondValidationError,
    standardController[`patch${tableName}`]
  );

  router.delete(
    "/:id",
    idParamValidation,
    respondValidationError,
    standardController[`delete${tableName}`]
  );

  return router;
};

export default createStandardRouter;
