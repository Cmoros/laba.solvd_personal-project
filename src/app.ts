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
import oldTrainsRouter from "./routers/train.router";
import stationsRouter from "./routers/station.router";
import schedulesRouter from "./routers/schedule.router";
import cyclesRouter from "./routers/cycle.router";
import routeSegmentsRouter from "./routers/routeSegment.router";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/login", loginValidation, loginHandler);
app.post("/register", registerValidation, registerHandler);

// Comment out the following line to disable authentication, for manual testing purposes
app.use(protect);

app.use("/employees", employeesRouter);
app.use("/lines", linesRouter);
app.use("/trains", oldTrainsRouter);
app.use("/stations", stationsRouter);
app.use("/schedules", schedulesRouter);
app.use("/cycles", cyclesRouter);

// Use of hyphen to separate words in route segments
// https://stackoverflow.com/a/18450653
// https://stackoverflow.com/a/38384600
// https://developers.google.com/search/docs/crawling-indexing/url-structure?hl=en&visit_id=638165758846024253-3322361827&rd=1
app.use("/route-segments", routeSegmentsRouter);

app.use(errorHandler);
// TODO add a 404 handler

export default app;
