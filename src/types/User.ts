export interface User {
  id: number;
  username: string;
  password: string;
}

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
