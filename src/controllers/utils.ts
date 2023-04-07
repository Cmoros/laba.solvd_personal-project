import { Response } from "express";
import QueryError from "../modules/QueryError";

export const handleQueryError = (res: Response, err: unknown) => {
  if (err instanceof QueryError) {
    res.status(404).json({ success: false, errors: [err.message] });
  } else {
    res.status(500).json({ success: false, errors: ["Internal server error"] });
  }
};

export const handleSuccessfulQuery = (
  res: Response,
  data: unknown,
  code = 200
) => {
  res.status(code).json({ success: true, data });
};
