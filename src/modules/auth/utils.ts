import bcrypt from "bcrypt";
import crypto from "crypto";
import { User, checkIsUserId, checkIsUserUsername } from "../../types/User";
import { getUserByUsername } from "../../models/user.model";
import AuthError from "./AuthError";
import { JWTData, checkIsJWTPayload } from "../../types/JWTData";

export const TIME_TO_EXPIRE = 1000 * 60 * 10; //ms

export const SALT = 10;

export const getTokenFromHeaders = (bearer: string | undefined) => {
  if (!bearer) {
    throw new AuthError(["No token found"]);
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    throw new AuthError(["Invalid token"]);
  }
  return token;
};

/*
const replaceSpecialChars = (b64string: string): string => {
  return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
    switch (charToBeReplaced) {
      case "=":
        return "";
      case "+":
        return "-";
      case "/":
        return "_";
    }
    return charToBeReplaced;
  });
};
*/

const toBase64 = (obj: object): string =>
  Buffer.from(JSON.stringify(obj)).toString("base64");

const createSignature = (
  header64: string,
  data64: string,
  secret: string
): string => {
  return crypto
    .createHmac("sha256", secret)
    .update(`${header64}.${data64}`)
    .digest("base64");
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, SALT);

const comparePassword = (
  password: string,
  dbPassword: string
): Promise<boolean> => bcrypt.compare(password, dbPassword);

const getNewExpTime = (date = new Date()): number =>
  date.getTime() + TIME_TO_EXPIRE;

export const generateToken = (
  { userId, username }: JWTData<User>,
  secret: string
): string => {
  const header64 = toBase64({ typ: "JWT", alg: "HS256" });
  const data64 = toBase64({ userId, username, exp: getNewExpTime() });
  const signature = createSignature(header64, data64, secret);
  return `${header64}.${data64}.${signature}`;
};

export const verifyToken = (token: string, secret: string): JWTData<User> => {
  const [header64, data64, signature64] = token.split(".");

  const expectedSignature = createSignature(header64, data64, secret);

  if (signature64 !== expectedSignature)
    throw new AuthError(["Not matching signatures"]);
  const userStr = Buffer.from(data64, "base64").toString();
  const payload: unknown = JSON.parse(userStr);
  if (!checkIsJWTPayload<JWTData<User>>(payload))
    throw new AuthError(["Unexpected Signature"]);
  const { username, userId, exp } = payload;
  if (!checkIsUserUsername(username) || !checkIsUserId(userId))
    throw new AuthError(["Unexpected Signature"]);
  if (new Date().getTime() > exp) throw new AuthError(["Expired token"]);
  return { username, userId };
};

export const authenticate = async (
  username: User["username"],
  password: User["password"]
): Promise<string> => {
  const user = await getUserByUsername(username);
  if (!user || !(await comparePassword(password, user.password)))
    throw new AuthError(["Wrong user or password"]);
  const { userId } = user;
  const token = generateToken(
    { userId, username },
    process.env.JWT_SECRET_KEY!
  );
  return token;
};
