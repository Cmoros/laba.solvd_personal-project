type FilterOut<A, B> = {
  [K in keyof A & keyof B]: A[K] extends B[K] ? never : K;
};

type FilterIn<A, B> = {
  [K in keyof A & keyof B]: A[K] extends B[K] ? K : never;
};

export type OptionalKeys<T> = FilterOut<T, Required<T>>[keyof T];

export type RequiredKeys<T> = FilterIn<T, Required<T>>[keyof T];

export type StringifiedKeys<T> = {
  [K in keyof T]: string;
};
export type EmptyObject = Record<string, never>;

export const checkIsEmptyObject = (toCheck: object): toCheck is EmptyObject => {
  if (typeof toCheck !== "object" || toCheck == null) return false;
  return Object.keys(toCheck).length === 0;
};

export type Schema<T extends object> = Record<
  keyof T,
  { type: "number" | "string"; required: boolean }
>;

// export const getPartialFromQuery = <T extends object>(
//   query: StringifiedKeys<T>,
//   fields: FieldType<T>
// ): Partial<T> => {
//   const partial: Partial<T> = {};
//   for (const key in query) {
//     if (query[key] === "") continue;
//     if (fields[key] === "number") {
//       partial[key] = Number(query[key]);
//     } else {
//       partial[key] = query[key];
//     }
//   }
//   return partial;
// };

export const getAllFields = <T extends object>(
  target: T,
  fields: Schema<T>
): T => {
  const allFields: T = {} as T;
  for (const key in fields) {
    allFields[key] = target[key];
  }
  return allFields;
};

export type TypesFromDB = number | string | undefined;
