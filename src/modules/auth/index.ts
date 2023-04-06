import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types/CustomRequest";
import {
  User,
  checkIsUserPassword,
  checkIsUserUsername,
} from "../../types/User";
import { createUser, getUserById } from "../../models/userMemory.model";
import AuthError from "./AuthError";
import {
  getTokenFromHeaders,
  verifyToken,
  authenticate,
  hashPassword,
  generateToken,
} from "./utils";

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  try {
    const token = getTokenFromHeaders(bearer);
    const user = verifyToken(token, process.env.JWT_SECRET_KEY!);
    const userFromDB = await getUserById(user.id);
    if (!userFromDB || userFromDB.username !== user.username) {
      throw new AuthError("User not found");
    }

    req.user = userFromDB;
    next();
  } catch (e: unknown) {
    res.status(401);
    res.setHeader("WWW-Authenticate", "Bearer");
    if (!(e instanceof AuthError)) {
      res.json({ success: false, error: "not authorized" });
      return;
    }
    res.json({ success: false, error: `not authorized: ${e.message}` });
  }
};

export const loginHandler = async (req: CustomRequest, res: Response) => {
  const user = req.body as Partial<User>;
  try {
    const { username, password } = user;
    if (!checkIsUserUsername(username) || !checkIsUserPassword(password)) {
      throw new AuthError("No user or password found");
    }
    const token: string = await authenticate(username, password);
    res.json({ success: true, data: { token } });
  } catch (e: unknown) {
    res.status(401);
    if (!(e instanceof AuthError)) {
      res.json({ success: false, error: "not authorized" });
      console.error(e);
      return;
    }
    res.json({ success: false, error: `not authorized: ${e.message}` });
  }
};

export const registerHandler = async (req: CustomRequest, res: Response) => {
  const user = req.body as Omit<User, "id">;
  try {
    const newUser = await createUser({
      ...user,
      password: await hashPassword(user.password),
    });
    const token = generateToken(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET_KEY!
    );
    res.status(201);
    res.json({ sucess: true, data: { token } });
  } catch (e: unknown) {
    res.status(400);
    res.json({ sucess: false, error: "Invalid user, not able to register" });
  }
};
