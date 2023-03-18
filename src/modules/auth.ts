import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { CustomRequest } from "../types/CustomRequest";
import UserController from "../controllers/UserController";
import { User, checkIsUserPassword, checkIsUserUsername } from "../types/User";

class AuthError extends Error {}

const generateToken = (
  payload: Pick<User, "id" | "username">,
  secret: string
): string => {
  const header = Buffer.from(
    JSON.stringify({ typ: "JTW", alg: "HS256" })
  ).toString("base64");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64");
  return `${header}.${data}.${signature}`;
};

const verifyToken = (
  token: string,
  secret: string
): Pick<User, "id" | "username"> | null => {
  const [header64, data64, signature64] = token.split(".");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(header64 + "." + data64)
    .digest("base64");

  if (signature64 !== expectedSignature) return null;
  const userStr = Buffer.from(data64, "base64").toString();
  return JSON.parse(userStr) as Pick<User, "id" | "username">;
};

const authenticate = (
  username: User["username"],
  password: User["password"]
) => {
  const user = new UserController().getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) return null;

  const token = generateToken(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET_KEY!
  );
  return token;
};

export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  try {
    if (!bearer) {
      throw new AuthError("No token found");
    }
    const [, token] = bearer.split(" ");
    if (!token) {
      throw new AuthError("Invalid token");
    }
    const user = verifyToken(token, process.env.JWT_SECRET_KEY!);
    if (!user) {
      throw new AuthError("Unexpected Signature");
    }
    const userFromDB = new UserController().getUserById(user.id);
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

export const login = (req: CustomRequest, res: Response) => {
  const user = req.body as Partial<User>;
  try {
    const { username, password } = user;
    if (!checkIsUserUsername(username) || !checkIsUserPassword(password)) {
      throw new AuthError("No user or password found");
    }
    const token = authenticate(username, password);
    if (!token) {
      throw new AuthError("Wrong user or password");
    }
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

export const register = (req: CustomRequest, res: Response) => {
  const user = req.body as Omit<User, "id">;
  try {
    const newUser = new UserController().postUser({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
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
