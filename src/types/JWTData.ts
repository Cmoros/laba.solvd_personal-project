export type JWTPayload<T> = T & { exp: number };

export type JWTData<T extends { id: unknown; username: unknown }> = Pick<
  T,
  "id" | "username"
>;

export const checkIsJWTPayload = <T>(
  toCheck: unknown
): toCheck is JWTPayload<T> => {
  if (typeof toCheck !== "object" || !toCheck) return false;
  return "exp" in toCheck && typeof toCheck.exp === "number";
};
