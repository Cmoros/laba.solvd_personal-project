import { Schema, OptionalKeys, RequiredKeys, StringifiedKeys } from "./utils";

export default interface Employee {
  id: number;
  name: string;
  position?: string;
}

export type NewEmployee = Omit<Employee, "id">;

export type StringifiedEmployee = StringifiedKeys<Employee>;

export type QueryEmployee = Partial<StringifiedEmployee | Employee>;

export const employeeOptionalFields: OptionalKeys<Employee>[] = ["position"];

export const employeeRequiredFields: RequiredKeys<Employee>[] = ["id", "name"];

export const newEmployeeSchema: Schema<NewEmployee> = {
  name: { type: "string", required: true },
  position: { type: "string", required: false },
};

export const employeeSchema: Schema<Employee> = {
  ...newEmployeeSchema,
  id: { type: "number", required: true },
};

// export const checkIsNewEmployee = (toCheck: unknown): employee is NewEmployee => {
//   if (typeof toCheck !== "object" || toCheck == null) return false;
//   for (const field of employeeRequiredFields) {
//     if (!(field in toCheck)) return false;
//   }
//   for const field of employeeOptionalFields) {

//   return isEmployee;
// }
