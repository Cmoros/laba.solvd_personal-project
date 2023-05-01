import { RequestHandler } from "express";
import { newUserSchema } from "../types/User";
import { body } from "express-validator";
import { fullBodyValidation } from "./schemaValidation";

export const registerValidation: RequestHandler[] =
  fullBodyValidation(newUserSchema);

export const loginValidation: RequestHandler[] = [
  body("username").isString().exists().withMessage("username is not valid"),
  body("password").isString().exists().withMessage("password is not valid"),
];
