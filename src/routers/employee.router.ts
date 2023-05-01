/* eslint-disable @typescript-eslint/no-misused-promises */
/*
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
*/
import { newEmployeeSchema } from "../types/Employee";
import createStandardRouter from "./standard.router";

// TODO Old unused code, remove later
/*
const oldEmployeesRouter = express.Router();
const validateFullBody = fullBodyValidation(newEmployeeSchema);
const validatePartialBody = partialBodyValidation(newEmployeeSchema);
const validateQueryParams = queryParamsValidation(newEmployeeSchema);

oldEmployeesRouter.get(
  "",
  validateQueryParams,
  respondValidationError,
  getEmployees
);

oldEmployeesRouter.get(
  "/:id",
  idParamValidation,
  respondValidationError,
  getEmployee
);

oldEmployeesRouter.post(
  "",
  validateFullBody,
  respondValidationError,
  postEmployee
);

oldEmployeesRouter.put(
  "/:id",
  idParamValidation,
  validateFullBody,
  respondValidationError,
  putEmployee
);

oldEmployeesRouter.patch(
  "/:id",
  idParamValidation,
  validatePartialBody,
  respondValidationError,
  patchEmployee
);

oldEmployeesRouter.delete(
  "/:id",
  idParamValidation,
  respondValidationError,
  deleteEmployee
);
*/
const employeesRouter = createStandardRouter("Employee", newEmployeeSchema);

export default employeesRouter;
