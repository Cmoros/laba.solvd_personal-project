import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../../types/User";
import { getUserByUsername } from "../../models/userMemory.model";
import AuthError from "./AuthError";
import { JWTData, checkIsJWTPayload } from "../../types/JWTData";

export const TIME_TO_EXPIRE = 1000 * 60; //ms

const SALT = 10;

export const getTokenFromHeaders = (bearer: string | undefined) => {
  if (!bearer) {
    throw new AuthError("No token found");
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    throw new AuthError("Invalid token");
  }
  return token;
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT);

const comparePassword = (
  password: string,
  dbPassword: string
): Promise<boolean> => bcrypt.compare(password, dbPassword);

const getNewExpDate = (date = new Date()) =>
  new Date(date.getTime() + TIME_TO_EXPIRE);

export const generateToken = (
  payload: JWTData<User>,
  secret: string
): string => {
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

export const verifyToken = (token: string, secret: string): JWTData<User> => {
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

export const authenticate = async (
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
