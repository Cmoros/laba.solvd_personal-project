import { generateToken } from "./src/modules/auth/utils";
import dotenv from "dotenv";

dotenv.config();

console.log(
  generateToken({ id: 10, username: "admin2" }, process.env.JWT_SECRET_KEY!)
);
