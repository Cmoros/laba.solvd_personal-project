import Model, { ModelId } from "./Model";
import { Schema, StringifiedKeys } from "./utils";

export type EmployeeTableName = "Employee";

export const EMPLOYEE_TABLE_NAME: EmployeeTableName = "Employee";

export default interface Employee extends Model<EmployeeTableName> {
  name: string;
  position?: string | null;
}

export type NewEmployee = Omit<Employee, ModelId<EmployeeTableName>>;

export type StringifiedEmployee = StringifiedKeys<Employee>;

export type QueryEmployee = Partial<StringifiedEmployee | Employee>;

// export const employeeOptionalFields: OptionalKeys<Employee>[] = ["position"];

// export const employeeRequiredFields: RequiredKeys<Employee>[] = [
//   "employeeId",
//   "name",
// ];

export const newEmployeeSchema: Schema<NewEmployee> = {
  name: { type: "string", required: true },
  position: { type: "string", required: false },
};

export const employeeSchema: Schema<Employee> = {
  ...newEmployeeSchema,
  employeeId: { type: "number", required: true },
};

// export const checkIsNewEmployee = (toCheck: unknown): employee is NewEmployee => {
//   if (typeof toCheck !== "object" || toCheck == null) return false;
//   for (const field of employeeRequiredFields) {
//     if (!(field in toCheck)) return false;
//   }
//   for const field of employeeOptionalFields) {

//   return isEmployee;
// }
