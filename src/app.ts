/* eslint-disable @typescript-eslint/no-misused-promises */
// https://github.com/expressjs/express/issues/4892
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { loginHandler, protect, registerHandler } from "./modules/auth";
import { CustomRequest } from "./types/CustomRequest";

dotenv.config();

// const HOSTNAME = "127.0.0.1";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.post("/login", loginHandler);
app.post("/register", registerHandler);

app.use(protect, (req: CustomRequest, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.send(
    `
  Hello ${req.user?.username ?? ""}
  Cesar Moros.
  Metro (employees, trains, schedules, etc.).
  The question is: what is the interval between trains at one time or another,
  if 6 cars and each accommodates 50 people,
  and the flow of people in the morning is 1000 people, at lunch 500, and in the evening 5000
  `
  );
});

export default app;
