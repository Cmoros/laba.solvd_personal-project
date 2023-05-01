import { NextFunction, Response } from "express";
import { UnauthorizedRequest } from "../../types/CustomRequest";
import {
  NewUser,
  checkIsUserPassword,
  checkIsUserUsername,
} from "../../types/User";
import { createUser, getUserById } from "../../models/user.model";
import AuthError from "./AuthError";
import {
  getTokenFromHeaders,
  verifyToken,
  authenticate,
  hashPassword,
  generateToken,
} from "./utils";
import { LoginUser } from "../../types/Auth";

export const protect = async (
  req: UnauthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  try {
    const token = getTokenFromHeaders(bearer);
    const user = verifyToken(token, process.env.JWT_SECRET_KEY!);
    const userFromDB = await getUserById(user.userId).catch(() => {
      throw new AuthError(["User not found"]);
    });
    if (!userFromDB || userFromDB.username !== user.username) {
      throw new AuthError(["User not found"]);
    }

    req.user = userFromDB;
    next();
  } catch (e: unknown) {
    res.status(401);
    res.setHeader("WWW-Authenticate", "Bearer");
    if (!(e instanceof AuthError)) {
      res.json({ success: false, errors: ["not authorized"] });
      return;
    }
    res.json({ success: false, errors: [`not authorized: ${e.message}`] });
  }
};

export const loginHandler = async (
  req: UnauthorizedRequest<Record<string, never>, LoginUser>,
  res: Response
) => {
  const user = req.body;
  try {
    const { username, password } = user;
    if (!checkIsUserUsername(username) || !checkIsUserPassword(password)) {
      throw new AuthError(["No user or password found"]);
    }
    const token: string = await authenticate(username, password);
    res.json({ success: true, data: { token } });
  } catch (e: unknown) {
    res.status(401);
    if (!(e instanceof AuthError)) {
      res.json({ success: false, errors: ["not authorized"] });
      return;
    }
    res.json({ success: false, errors: [`not authorized: ${e.message}`] });
  }
};

export const registerHandler = async (
  req: UnauthorizedRequest<Record<string, never>, NewUser>,
  res: Response
) => {
  const user = req.body;
  try {
    if (
      !checkIsUserUsername(user.username) ||
      !checkIsUserPassword(user.password)
    ) {
      throw new Error();
    }
    const newUser = await createUser({
      ...user,
      password: await hashPassword(user.password),
    });
    const token = generateToken(
      { userId: newUser.userId, username: newUser.username },
      process.env.JWT_SECRET_KEY!
    );
    res.status(201);
    res.json({ success: true, data: { token } });
  } catch (e: unknown) {
    res.status(400);
    res.json({
      success: false,
      errors: ["Invalid user, not able to register"],
    });
  }
};
