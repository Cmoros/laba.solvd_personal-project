import { users } from "../db/users";
import { User } from "../types/User";

export default class UserModelMemory {
  db = users;
  getUserByUsername(username: User["username"]): User | null {
    for (const id in this.db) {
      const user = this.db[id];
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  getUserById(id: User["id"]): User | null {
    return this.db[id] ?? null;
  }

  createUser(user: Omit<User, "id">): User {
    const users = Object.values(this.db);
    if (users.find((u) => u.username === user.username)) {
      throw new Error("Duplicated username");
    }
    const id = users.length;
    const newUser: User = { id, ...user };
    this.db[id] = newUser;
    return newUser;
  }
}
