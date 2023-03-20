// import bcrypt from "bcrypt";

import { User } from "../types/User";

const users: Record<User["id"], User> = {
  1: {
    id: 1,
    username: "admin",
    password: "$2b$10$rq88dAg6NnX3QkZvpcLgeeYuM/.R67DDFV7Uxgvr6/VdOkwmv4AaG", //admin123
  },
  2: {
    id: 2,
    username: "user",
    password: "$2b$10$V4h/tabohOJWBD9xFBMeMuSoNZEmqNU7w8sE7h5mdgRw5D6FKDtyS", //user123
  },
};

export default users;
