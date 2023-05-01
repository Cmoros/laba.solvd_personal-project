import { NextFunction, Response } from "express";
import QueryError, { QueryErrorMessage } from "../modules/QueryError";

export const handleQueryError = (
  err: unknown,
  message: QueryErrorMessage,
  next: NextFunction
) => {
  if (err instanceof QueryError) {
    next(new QueryError([message, ...err.msg]));
  } else if (err instanceof Error) {
    next(new QueryError([message, err.message]));
  } else {
    next(new QueryError([message]));
  }
};

export const handleSuccessfulQuery = (
  res: Response,
  data: unknown,
  code = 200 // 200 = OK, 201 = Created, 204 = No Content
) => {
  if (code === 204) {
    res.status(204).end();
  } else {
    res.status(code).json({ success: true, data });
  }
};
