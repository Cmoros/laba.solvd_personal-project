/* eslint-disable @typescript-eslint/no-misused-promises */
// https://github.com/expressjs/express/issues/4892
import express from "express";
import morgan from "morgan";
import { loginHandler, protect, registerHandler } from "./modules/auth";
import {
  loginValidation,
  registerValidation,
} from "./middlewares/userValidations";
import employeesRouter from "./routers/employee.router";

// const HOSTNAME = "127.0.0.1";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/login", loginValidation, loginHandler);
app.post("/register", registerValidation, registerHandler);

// app.use(protect);

app.use("/employees", employeesRouter);

export default app;
