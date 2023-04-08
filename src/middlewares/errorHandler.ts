import { NextFunction, Request, Response } from "express";
import ServerError from "../modules/ServerError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (!(err instanceof ServerError)) {
    console.error(err);
    res.status(500).json({ success: false, errors: ["Internal server error"] });
  } else {
    err.respond(res);
  }
};
