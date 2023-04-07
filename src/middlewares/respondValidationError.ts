import { validationResult } from "express-validator";
import { Response, NextFunction, RequestHandler, Request } from "express";

export const respondValidationError: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({
        success: false,
        errors: errors.array().map(({ msg }) => msg as string),
      });
    return;
  }
  next();
};
