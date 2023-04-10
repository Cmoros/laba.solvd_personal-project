import Model from "./Model";
import { Schema } from "./utils";

type UserTableName = "User";

export const USER_TABLE_NAME: UserTableName = "User";

export interface User extends Model<UserTableName> {
  username: string;
  password: string;
  employeeId: number;
  email?: string | null;
}

export type NewUser = Omit<User, `${Uncapitalize<UserTableName>}Id`>;

export const checkIsUserUsername = (
  toCheck: unknown
): toCheck is User["username"] => {
  return typeof toCheck === "string";
};

export const checkIsUserPassword = (
  toCheck: unknown
): toCheck is User["password"] => {
  return typeof toCheck === "string";
};

export const checkIsUserId = (toCheck: unknown): toCheck is User["userId"] => {
  return typeof toCheck === "number";
};

export const newUserSchema: Schema<NewUser> = {
  username: { type: "string", required: true },
  password: { type: "string", required: true },
  employeeId: { type: "number", required: true },
  email: { type: "string", required: false },
};

export const userSchema: Schema<User> = {
  ...newUserSchema,
  userId: { type: "number", required: true },
};
