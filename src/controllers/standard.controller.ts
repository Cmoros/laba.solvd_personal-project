/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "../types/CustomRequest";
import { EmptyObject, Schema, checkIsEmptyObject } from "../types/utils";
import createStandardModel from "../models/standard.model";
import { handleQueryError, handleSuccessfulQuery } from "./utils";
import Model from "../types/Model";

type StandardController<T extends string, M extends Model<T>> = {
  [key in `get${T}s`]: (
    req: AuthorizedRequest<
      EmptyObject,
      EmptyObject,
      // QueryParams<T>
      Record<string, string>
    >,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
} & {
  [key in `get${T}`]: (
    req: AuthorizedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
} & {
  [key in `post${T}`]: (
    req: AuthorizedRequest<Record<string, never>, Omit<M, "id">>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
} & {
  [key in `patch${T}`]: (
    req: AuthorizedRequest<{ id: string }, Partial<Omit<M, "id">>>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
} & {
  [key in `put${T}`]: (
    req: AuthorizedRequest<{ id: string }, Omit<M, "id">>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
} & {
  [key in `delete${T}`]: (
    req: AuthorizedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
};

const createStandardController = <T extends string, M extends Model<T>>(
  tableName: T,
  newItemSchema: Schema<Omit<M, `${Uncapitalize<T>}Id`>>
): StandardController<T, M> => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const standardModel: Record<string, Function> = createStandardModel(
    tableName,
    newItemSchema
  );
  return {
    async [`get${tableName}s`](
      req: AuthorizedRequest<
        EmptyObject,
        EmptyObject,
        // QueryParams<T>
        Record<string, string>
      >,
      res: Response,
      next: NextFunction
    ) {
      const { query } = req;
      let items: M[];
      try {
        if (checkIsEmptyObject(query)) {
          items = await standardModel[`getAll${tableName}s`]();
        } else {
          items = await standardModel[`get${tableName}sByQuery`](query);
        }
        handleSuccessfulQuery(res, items);
      } catch (error: unknown) {
        handleQueryError(error, "Not found", next);
      }
    },

    async [`get${tableName}`](
      req: AuthorizedRequest<{ id: string }>,
      res: Response,
      next: NextFunction
    ) {
      const { id } = req.params;
      try {
        const item = await standardModel[`get${tableName}ById`](+id);
        handleSuccessfulQuery(res, item);
      } catch (error: unknown) {
        handleQueryError(error, "Not found", next);
      }
    },

    async [`post${tableName}`](
      req: AuthorizedRequest<
        Record<string, never>,
        Omit<M, "id"> | Omit<M, "id">[]
      >,
      res: Response,
      next: NextFunction
    ) {
      const incoming = req.body;
      let created: M | M[];
      try {
        // TODO Add support for creating multiple items (this is not supported by the validation middleware)
        // if (Array.isArray(incoming)) {
        //   created = await standardModel[`create${tableName}s`](incoming);
        // } else {
        created = await standardModel[`create${tableName}`](incoming);
        // }
        handleSuccessfulQuery(res, created, 201);
      } catch (error) {
        handleQueryError(error, "Not created", next);
      }
    },

    async [`put${tableName}`](
      req: AuthorizedRequest<{ id: string }, Partial<Omit<M, "id">>>,
      res: Response,
      next: NextFunction
    ) {
      const { id } = req.params;
      const updatedItem = req.body;
      try {
        const updated = await standardModel[`replace${tableName}ById`](
          +id,
          updatedItem
        );
        handleSuccessfulQuery(res, updated);
      } catch (error) {
        handleQueryError(error, "Not updated", next);
      }
    },

    async [`patch${tableName}`](
      req: AuthorizedRequest<{ id: string }, Partial<Omit<M, "id">>>,
      res: Response,
      next: NextFunction
    ) {
      const { id } = req.params;
      const updatedItem = req.body;
      try {
        const updated = await standardModel[`patch${tableName}ById`](
          +id,
          updatedItem
        );
        handleSuccessfulQuery(res, updated);
      } catch (error) {
        handleQueryError(error, "Not updated", next);
      }
    },

    async [`delete${tableName}`](
      req: AuthorizedRequest<{ id: string }>,
      res: Response,
      next: NextFunction
    ) {
      const { id } = req.params;
      try {
        const deleted = await standardModel[`delete${tableName}ById`](+id);
        handleSuccessfulQuery(res, deleted, 204);
      } catch (error) {
        handleQueryError(error, "Not deleted", next);
      }
    },
  } as StandardController<T, M>;
};

export default createStandardController;
