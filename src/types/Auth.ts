import { AuthErrorMessage } from "../modules/auth/AuthError";

export type LoginResponse =
  | {
      success: true;
      data: { token: string };
    }
  | {
      success: false;
      error:
        | `not authorized: ${Extract<
            AuthErrorMessage,
            "No user or password found" | "Wrong user or password"
          >}`
        | "not authorized";
    };

export type RegisterResponse =
  | {
      success: true;
      data: { token: string };
    }
  | {
      success: false;
      error: "Invalid user, not able to register";
    };
