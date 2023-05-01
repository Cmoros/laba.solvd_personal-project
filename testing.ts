import { generateToken } from "./src/modules/auth/utils";
import dotenv from "dotenv";

dotenv.config();

console.log(
  generateToken({ userId: 1, username: "admin" }, process.env.JWT_SECRET_KEY!)
);
