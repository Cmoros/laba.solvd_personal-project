import { Response } from "express";
import ServerError from "./ServerError";

export default class ValidationError extends ServerError {
  constructor(public msg: string[]) {
    super(msg);
    this.name = "ValidationError";
  }

  respond(res: Response): void {
    res.status(400).json({
      success: false,
      errors: this.msg,
    });
  }
}
