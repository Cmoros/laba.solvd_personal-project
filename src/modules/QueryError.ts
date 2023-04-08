import { Response } from "express";
import ServerError from "./ServerError";

export type QueryErrorMessage =
  | "Not found"
  | "Not created"
  | "Not updated"
  | "Not deleted"
  | "Not patched"
  | "No rows returned";

export default class QueryError extends ServerError {
  constructor(public msg: [QueryErrorMessage, ...string[]]) {
    super(msg);
    this.name = "QueryError";
  }

  respond(res: Response): void {
    res.status(404).json({ success: false, errors: this.msg });
  }
}
