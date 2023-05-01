export type JWTPayload<T> = T & { exp: number };

export type JWTData<T extends { userId: unknown; username: unknown }> = Pick<
  T,
  "userId" | "username"
>;

export const checkIsJWTPayload = <T>(
  toCheck: unknown
): toCheck is JWTPayload<T> => {
  if (typeof toCheck !== "object" || !toCheck) return false;
  return "exp" in toCheck && typeof toCheck.exp === "number";
};
