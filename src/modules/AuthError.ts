type AuthErrorMessage =
  | "No token found"
  | "Invalid token"
  | "Unexpected Signature"
  | "User not found"
  | "No user or password found"
  | "Wrong user or password"
  | "Expired token"
  | "Not matching signatures";

export default class AuthError extends Error {
  constructor(message: AuthErrorMessage) {
    super(message);
  }
}
