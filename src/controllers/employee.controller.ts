import { NextFunction, Response } from "express";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByQuery,
  patchEmployeeById,
  replaceEmployeeById,
} from "../models/employee.model";
import { AuthorizedRequest } from "../types/CustomRequest";
import Employee, { NewEmployee } from "../types/Employee";
import { EmptyObject, checkIsEmptyObject } from "../types/utils";
import { QueryParams } from "../types/Auth";
import { handleQueryError, handleSuccessfulQuery } from "./utils";

export const getEmployees = async (
  req: AuthorizedRequest<EmptyObject, EmptyObject, QueryParams<Employee>>,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  let employees: Employee[];
  try {
    if (checkIsEmptyObject(query)) {
      employees = await getAllEmployees();
    } else {
      employees = await getEmployeesByQuery(query);
    }
    handleSuccessfulQuery(res, employees);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const getEmployee = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const employee = await getEmployeeById(+id);
    handleSuccessfulQuery(res, employee);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const postEmployee = async (
  req: AuthorizedRequest<Record<string, never>, NewEmployee>,
  res: Response,
  next: NextFunction
) => {
  const newEmployee = req.body;
  try {
    const createdEmployee = await createEmployee(newEmployee);
    handleSuccessfulQuery(res, createdEmployee, 201);
  } catch (error) {
    handleQueryError(error, "Not created", next);
  }
};

export const putEmployee = async (
  req: AuthorizedRequest<{ id: string }, NewEmployee>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newEmployee = req.body;
  try {
    const replacedEmployee = await replaceEmployeeById(+id, newEmployee);
    handleSuccessfulQuery(res, replacedEmployee);
  } catch (error) {
    handleQueryError(error, "Not updated", next);
  }
};

export const patchEmployee = async (
  req: AuthorizedRequest<{ id: string }, Partial<NewEmployee>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const partialEmployee = req.body;
  try {
    const patchedEmployee = await patchEmployeeById(+id, partialEmployee);
    handleSuccessfulQuery(res, patchedEmployee);
  } catch (error) {
    handleQueryError(error, "Not patched", next);
  }
};

export const deleteEmployee = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await deleteEmployeeById(+id);
    res.status(204).end();
  } catch (error) {
    handleQueryError(error, "Not deleted", next);
  }
};
