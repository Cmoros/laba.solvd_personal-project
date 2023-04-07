import pool from "../db/pool";
import { getCreateQuery, getSearchQuery, getUpdateQuery } from "../db/utils";
import QueryError from "../modules/QueryError";
import Employee, {
  NewEmployee,
  QueryEmployee,
  newEmployeeSchema,
} from "../types/Employee";
import { getAllFields } from "../types/utils";

const TABLE_NAME = "Employee";

export const getAllEmployees = async (): Promise<Employee[]> => {
  const employees = await pool.query<Employee>(`SELECT * FROM ${TABLE_NAME}`);
  return employees.rows;
};

export const getEmployeesByQuery = async (
  query: QueryEmployee
): Promise<Employee[]> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, query);
  const employees = await pool.query<Employee>(queryString, values);
  return employees.rows;
};

export const getEmployeeById = async (
  id: Employee["id"]
): Promise<Employee> => {
  const { queryString, values } = getSearchQuery(TABLE_NAME, { id });
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError("Not found");

  return employee.rows[0];
};

export const createEmployee = async (
  newEmployee: NewEmployee
): Promise<Employee> => {
  const { queryString, values } = getCreateQuery(TABLE_NAME, newEmployee);
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError("Not created");

  return employee.rows[0];
};

export const replaceEmployeeById = async (
  id: Employee["id"],
  updatedEmployee: NewEmployee
): Promise<Employee> => {
  const employeeWithAllFields = getAllFields(
    updatedEmployee,
    newEmployeeSchema
  );
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    employeeWithAllFields,
    id
  );
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError("Not updated");
  return employee.rows[0];
};

export const patchEmployeeById = async (
  id: Employee["id"],
  updatedEmployee: Partial<NewEmployee>
): Promise<Employee> => {
  const { queryString, values } = getUpdateQuery(
    TABLE_NAME,
    updatedEmployee,
    id
  );
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError("Not patched");

  return employee.rows[0];
};

export const deleteEmployeeById = async (
  id: Employee["id"]
): Promise<Employee> => {
  const queryString = `DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`;
  const values = [id];
  const employee = await pool.query<Employee>(queryString, values);
  if (employee.rows.length === 0) throw new QueryError("Not deleted");
  return employee.rows[0];
};
