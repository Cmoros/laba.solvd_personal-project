/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { body, param, query } from "express-validator";
import { Schema } from "../types/utils";

export const queryParamsValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const { type } = value as any;
    return query(key)
      [type === "number" ? "isNumeric" : "isString"]()
      .optional()
      .withMessage(`${key} is missing or is not valid`);
  });

export const fullBodyValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const { type, required } = value as any;
    return body(key)
      [type === "number" ? "isNumeric" : "isString"]()
      [required ? "exists" : "optional"]()
      .withMessage(`${key} is missing or is not valid`);
  });

export const partialBodyValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const { type } = value as any;
    return body(key)
      [type === "number" ? "isNumeric" : "isString"]()
      .optional()
      .withMessage(`${key} is missing or is not valid`);
  });

export const idParamValidation = [
  param("id").isNumeric().withMessage("id is not valid"),
];
