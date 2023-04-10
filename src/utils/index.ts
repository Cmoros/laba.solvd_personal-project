export const uncapitalize = <T extends string>(str: T): Uncapitalize<T> => {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>;
};

export const capitalize = <T extends string>(str: T): Capitalize<T> => {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
};
