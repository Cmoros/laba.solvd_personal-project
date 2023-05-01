import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Employee, {
  EMPLOYEE_TABLE_NAME,
  EmployeeTableName,
  NewEmployee,
  QueryEmployee,
  newEmployeeSchema,
} from "../types/Employee";
import { ModelId, getModelId } from "../types/Model";
import { getAllFields } from "../types/utils";

export const getAllEmployees = async (): Promise<Employee[]> => {
  const employees = await pool.query<Employee>(
    `SELECT * FROM "${EMPLOYEE_TABLE_NAME}"`
  );
  return employees.rows;
};

export const getEmployeesByQuery = async (
  query: QueryEmployee
): Promise<Employee[]> => {
  const { queryString, values } = getSearchQuery(EMPLOYEE_TABLE_NAME, query);
  const employees = await pool.query<Employee>(queryString, values);
  return employees.rows;
};

export const getEmployeeById = async (
  id: Employee[ModelId<EmployeeTableName>]
): Promise<Employee> => {
  const { queryString, values } = getSearchQuery(EMPLOYEE_TABLE_NAME, {
    [getModelId(EMPLOYEE_TABLE_NAME)]: id,
  });
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);

  return employee.rows[0];
};

export const createEmployee = async (
  newEmployee: NewEmployee
): Promise<Employee> => {
  const { queryString, values } = getCreateQuery(
    EMPLOYEE_TABLE_NAME,
    newEmployee
  );
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);

  return employee.rows[0];
};

export const replaceEmployeeById = async (
  id: Employee[ModelId<EmployeeTableName>],
  updatedEmployee: NewEmployee
): Promise<Employee> => {
  const employeeWithAllFields = getAllFields(
    updatedEmployee,
    newEmployeeSchema
  );
  const { queryString, values } = getUpdateQuery(
    EMPLOYEE_TABLE_NAME,
    employeeWithAllFields,
    id
  );
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};

export const patchEmployeeById = async (
  id: Employee[ModelId<EmployeeTableName>],
  updatedEmployee: Partial<NewEmployee>
): Promise<Employee> => {
  const { queryString, values } = getUpdateQuery(
    EMPLOYEE_TABLE_NAME,
    updatedEmployee,
    id
  );
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);

  return employee.rows[0];
};

export const deleteEmployeeById = async (
  id: Employee[ModelId<EmployeeTableName>]
): Promise<Employee> => {
  const queryString = `DELETE FROM "${EMPLOYEE_TABLE_NAME}" WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError(["No rows returned"]);
  return employee.rows[0];
};
