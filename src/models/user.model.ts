import {
  USER_TABLE_NAME,
  User,
  UserTableName,
  newUserSchema,
} from "../types/User";
import createStandardModel from "./standard.model";

const { createUser, getUserById, getUsersByQuery } = createStandardModel<
  UserTableName,
  User
>(USER_TABLE_NAME, newUserSchema);

export const getUserByUsername = async (username: User["username"]) =>
  (await getUsersByQuery({ username }))[0];

export { createUser, getUserById, getUsersByQuery };
