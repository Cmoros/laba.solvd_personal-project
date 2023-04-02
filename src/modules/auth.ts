import { NextFunction, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { CustomRequest } from "../types/CustomRequest";
import { User, checkIsUserPassword, checkIsUserUsername } from "../types/User";
import {
  createUser,
  getUserById,
  getUserByUsername,
} from "../models/userMemory.model";
import AuthError from "./AuthError";

const TIME_TO_EXPIRE = 1000 * 60; //ms
const SALT = 10;

type JWTPayload<T> = T & { exp: string };

type JWTData<T extends { id: unknown; username: unknown }> = Pick<
  T,
  "id" | "username"
>;

const checkIsJWTPayload = <T>(toCheck: unknown): toCheck is JWTPayload<T> => {
  if (typeof toCheck !== "object" || !toCheck) return false;
  return "exp" in toCheck && typeof toCheck.exp === "string";
};

const getTokenFromHeaders = (bearer: string | undefined) => {
  if (!bearer) {
    throw new AuthError("No token found");
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    throw new AuthError("Invalid token");
  }
  return token;
};

const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT);

const comparePassword = (
  password: string,
  dbPassword: string
): Promise<boolean> => bcrypt.compare(password, dbPassword);

const getNewExpDate = (date = new Date()) =>
  new Date(date.getTime() + TIME_TO_EXPIRE);

const generateToken = (payload: JWTData<User>, secret: string): string => {
  const header = Buffer.from(
    JSON.stringify({ typ: "JTW", alg: "HS256" })
  ).toString("base64");
  const data = Buffer.from(
    JSON.stringify({ ...payload, exp: getNewExpDate() })
  ).toString("base64");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64");
  return `${header}.${data}.${signature}`;
};

const verifyToken = (token: string, secret: string): JWTData<User> => {
  const [header64, data64, signature64] = token.split(".");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(header64 + "." + data64)
    .digest("base64");

  if (signature64 !== expectedSignature)
    throw new AuthError("Not matching signatures");
  const userStr = Buffer.from(data64, "base64").toString();
  const payload: unknown = JSON.parse(userStr);
  if (!checkIsJWTPayload<JWTData<User>>(payload))
    throw new AuthError("Unexpected Signature");
  const { username, id, exp } = payload;
  const expDate = new Date(exp);
  if (expDate < new Date()) throw new AuthError("Expired token");
  return { username, id };
};

const authenticate = async (
  username: User["username"],
  password: User["password"]
): Promise<string> => {
  const user = await getUserByUsername(username);
  if (!user || !(await comparePassword(password, user.password)))
    throw new AuthError("Wrong user or password");

  const token = generateToken(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET_KEY!
  );
  return token;
};

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

export const loginHandler = (req: CustomRequest, res: Response) => {
  const user = req.body as Partial<User>;
  try {
    const { username, password } = user;
    if (!checkIsUserUsername(username) || !checkIsUserPassword(password)) {
      throw new AuthError("No user or password found");
    }
    const token = authenticate(username, password);
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
