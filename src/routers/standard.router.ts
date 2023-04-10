import { RequestHandler, Router } from "express";
import Model, { ModelId } from "../types/Model";
import createStandardController from "../controllers/standard.controller";
import { Schema } from "../types/utils";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";

/**
 * Creates a router with the REST routes: GET(all) GET(one) POST PUT PATCH DELETE, for a given schema and table name. Includes validation, error handling, controllers and models. It can be used as a base for more complex routers, or as a router for a simple CRUD. It can be extended with more routes, as third parameter it takes a router, so you can create one and add routes that override the standard ones and then pass it as third parameter, or also add more routes to it to the returned router.
 */
const createStandardRouter = <T extends string, M extends Model<T>>(
  tableName: T,
  newItemSchema: Schema<Omit<M, ModelId<T>>>,
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

  // TODO Add validation wether is array or not, for creating many(don't really know how to do it with express-validator)
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
