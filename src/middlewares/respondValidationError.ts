import { validationResult } from "express-validator";
import { Response, NextFunction, RequestHandler, Request } from "express";
import ValidationError from "../modules/ValidationError";

export const respondValidationError: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationError(errors.array().map((e) => e.msg as string)));
    return;
  }
  next();
};
