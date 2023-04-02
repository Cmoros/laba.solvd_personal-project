import { AuthErrorMessage } from "../modules/AuthError";

export type LoginResponse =
  | {
      success: true;
      data: { token: string };
    }
  | {
      success: false;
      error:
        | `not authorized${Extract<
            AuthErrorMessage,
            "No user or password found" | "Wrong user or password"
          >}`
        | "not authorized";
    };
