/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { body, param, query } from "express-validator";
import { Schema } from "../types/utils";
import { NextFunction, Request, Response } from "express";
import { getModelId } from "../types/Model";

// FIXME fix this any types and the eslint-disable

export const queryParamsValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const dinamicFnName = {
      [`validateQueryParam${key[0].toUpperCase()}${key.slice(1)}`](
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const { type } = value as any;
        return query(key)
          [type === "number" ? "isNumeric" : "isString"]()
          .optional()
          .withMessage(`${key} is missing or is not valid`)(req, res, next);
      },
    };
    return dinamicFnName[
      `validateQueryParam${key[0].toUpperCase()}${key.slice(1)}`
    ];
  });

export const fullBodyValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const dinamicFnName = {
      [`validateBody${key[0].toUpperCase()}${key.slice(1)}`](
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const { type, required } = value as any;
        return body(key)
          [type === "number" ? "isNumeric" : "isString"]()
          [required ? "exists" : "optional"]()
          .withMessage(`${key} is missing or is not valid`)(req, res, next);
      },
    };
    return dinamicFnName[`validateBody${key[0].toUpperCase()}${key.slice(1)}`];
  });

export const partialBodyValidation = <T extends object>(schema: Schema<T>) =>
  Object.entries(schema).map(([key, value]) => {
    const dinamicFnName = {
      [`validatePartialBody${key[0].toUpperCase()}${key.slice(1)}`](
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const { type } = value as any;
        return body(key)
          [type === "number" ? "isNumeric" : "isString"]()
          .optional()
          .withMessage(`${key} is missing or is not valid`)(req, res, next);
      },
    };
    return dinamicFnName[
      `validatePartialBody${key[0].toUpperCase()}${key.slice(1)}`
    ];
  });

export const idParamValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return param("id").isNumeric().withMessage("id is not valid")(req, res, next);
};

export const idBodyValidation = (tableName: string) => {
  return function validateBodyIdMissing(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const modelId = getModelId(tableName);
    return body(modelId)
      .not()
      .exists()
      .withMessage(`${modelId} should not be in body`)(req, res, next);
  };
};
