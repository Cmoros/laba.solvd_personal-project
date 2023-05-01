import { Request } from "express";
import { User } from "./User";

export interface AuthorizedRequest<
  P extends Record<string, string> = Record<string, never>,
  ReqBody extends object = Record<string, never>,
  ReqQuery extends Record<string, string> = Record<string, never>
> extends Request<P, Record<string, never>, ReqBody, ReqQuery> {
  user?: User;
}

export interface UnauthorizedRequest<
  P extends Record<string, string> = Record<string, never>,
  ReqBody extends object = Record<string, never>,
  ReqQuery extends Record<string, string> = Record<string, never>
> extends Request<P, Record<string, never>, ReqBody, ReqQuery> {
  user?: User;
}
