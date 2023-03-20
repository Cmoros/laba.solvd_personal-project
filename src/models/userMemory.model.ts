import usersDB from "../db/users";
import { User } from "../types/User";

export const getUserByUsername = (username: User["username"]): User | null => {
  for (const id in usersDB) {
    const user = usersDB[id];
    if (user.username === username) {
      return user;
    }
  }
  return null;
};

export const getUserById = (id: User["id"]): User | null => {
  return usersDB[id] ?? null;
};

export const createUser = (user: Omit<User, "id">): User => {
  const users = Object.values(usersDB);

  if (users.find((u) => u.username === user.username)) {
    throw new Error("Duplicated username");
  }
  const id = users.length;
  const newUser: User = { id, ...user };
  usersDB[id] = newUser;
  return newUser;
};
