import { Schema } from "./utils";

export interface User {
  id: number;
  username: string;
  password: string;
}

export type NewUser = Omit<User, "id">;

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

export const checkIsUserId = (toCheck: unknown): toCheck is User["id"] => {
  return typeof toCheck === "number";
};

export const newUserSchema: Schema<NewUser> = {
  username: { type: "string", required: true },
  password: { type: "string", required: true },
};

export const userSchema: Schema<User> = {
  ...newUserSchema,
  id: { type: "number", required: true },
};
