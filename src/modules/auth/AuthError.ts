import { Response } from "express";
import ServerError from "../ServerError";

export type AuthErrorMessage =
  | "No token found"
  | "Invalid token"
  | "Unexpected Signature"
  | "User not found"
  | "No user or password found"
  | "Wrong user or password"
  | "Expired token"
  | "Not matching signatures";

export default class AuthError extends ServerError {
  constructor(public msg: [AuthErrorMessage, ...string[]]) {
    super(msg);
  }

  respond(res: Response): void {
    res
      .status(401)
      .json({
        success: false,
        errors: ["not authorized: " + this.msg[0], ...this.msg.slice(1)],
      });
  }
}
