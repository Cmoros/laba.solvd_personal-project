// import bcrypt from "bcrypt";

import { User } from "../types/User";

const users: Record<User["userId"], User> = {
  1: {
    userId: 1,
    username: "admin",
    employeeId: 1,
    email: null,
    password: "$2b$10$rq88dAg6NnX3QkZvpcLgeeYuM/.R67DDFV7Uxgvr6/VdOkwmv4AaG", //admin123
  },
  2: {
    userId: 2,
    username: "user",
    employeeId: 2,
    email: null,
    password: "$2b$10$V4h/tabohOJWBD9xFBMeMuSoNZEmqNU7w8sE7h5mdgRw5D6FKDtyS", //user123
  },
};

export default users;
