import { AuthErrorMessage } from "../modules/auth/AuthError";
import { User } from "./User";

export type LoginResponse =
  | {
      success: true;
      data: { token: string };
    }
  | {
      success: false;
      errors:
        | [
            `not authorized: ${Extract<
              AuthErrorMessage,
              "No user or password found" | "Wrong user or password"
            >}`
          ]
        | ["not authorized"];
    };

export type RegisterResponse =
  | {
      success: true;
      data: { token: string };
    }
  | {
      success: false;
      errors: ["Invalid user, not able to register"];
    };

export type ProtectResponse = {
  success: false;
  errors: [`not authorized: ${AuthErrorMessage}`];
};

export type QueryParams<T> = {
  [K in keyof T]?: string;
};

export type LoginUser = {
  username: User["username"];
  password: User["password"];
};
