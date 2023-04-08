/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  getEmployees,
  getEmployee,
  patchEmployee,
  putEmployee,
  deleteEmployee,
  postEmployee,
} from "../controllers/employee.controller";
import {
  fullBodyValidation,
  idParamValidation,
  partialBodyValidation,
  queryParamsValidation,
} from "../middlewares/schemaValidation";
import { respondValidationError } from "../middlewares/respondValidationError";
import { newEmployeeSchema } from "../types/Employee";

const employeesRouter = express.Router();
const validateFullBody = fullBodyValidation(newEmployeeSchema);
const validatePartialBody = partialBodyValidation(newEmployeeSchema);
const validateQueryParams = queryParamsValidation(newEmployeeSchema);

employeesRouter.get(
  "",
  validateQueryParams,
  respondValidationError,
  getEmployees
);

employeesRouter.get(
  "/:id",
  idParamValidation,
  respondValidationError,
  getEmployee
);

employeesRouter.post(
  "",
  validateFullBody,
  respondValidationError,
  postEmployee
);

employeesRouter.put(
  "/:id",
  idParamValidation,
  validateFullBody,
  respondValidationError,
  putEmployee
);

employeesRouter.patch(
  "/:id",
  idParamValidation,
  validatePartialBody,
  respondValidationError,
  patchEmployee
);

employeesRouter.delete(
  "/:id",
  idParamValidation,
  respondValidationError,
  deleteEmployee
);

export default employeesRouter;
