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
import { errorHandler } from "./middlewares/errorHandler";
import linesRouter from "./routers/line.router";
import trainsRouter from "./routers/train.router";
import stationsRouter from "./routers/station.router";

// const HOSTNAME = "127.0.0.1";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/login", loginValidation, loginHandler);
app.post("/register", registerValidation, registerHandler);

// app.use(protect);

// Write an error handler in typescript

app.use("/employees", employeesRouter);

app.use("/lines", linesRouter);
app.use("/trains", trainsRouter);
app.use("/stations", stationsRouter);

// TODO Schedule router
// TODO Cycle router
// TODO RouteSegment router

app.use(errorHandler);
// TODO add a 404 handler

export default app;
