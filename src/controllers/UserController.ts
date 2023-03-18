import UserModel from "../models/UserModelMemory";
import { User } from "../types/User";

export default class UserController {
  constructor(private model = new UserModel()) {}

  getUserByUsername(username: User["username"]) {
    return this.model.getUserByUsername(username);
  }

  getUserById(id: User["id"]) {
    return this.model.getUserById(id);
  }

  postUser(user: Omit<User, "id">): User {
    return this.model.createUser(user);
  }
}
