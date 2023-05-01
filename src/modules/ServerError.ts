import { Response } from "express";

export default class ServerError extends Error {
  constructor(public msg: string[]) {
    super(msg.join(", "));
    this.name = "ServerError";
  }

  respond(res: Response): void {
    res
      .status(500)
      .json({ success: false, errors: ["Internal server error", ...this.msg] });
  }
}
