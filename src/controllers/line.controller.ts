import { NextFunction, Response } from "express";
import {
  createLine,
  deleteLineById,
  getAllLines,
  getLineById,
  getLinesByQuery,
  patchLineById,
  replaceLineById,
} from "../models/line.model";
import { AuthorizedRequest } from "../types/CustomRequest";
import Line, { NewLine } from "../types/Line";
import { EmptyObject, checkIsEmptyObject } from "../types/utils";
import { QueryParams } from "../types/Auth";
import { handleQueryError, handleSuccessfulQuery } from "./utils";

export const getLines = async (
  req: AuthorizedRequest<EmptyObject, EmptyObject, QueryParams<Line>>,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  let lines: Line[];
  try {
    if (checkIsEmptyObject(query)) {
      lines = await getAllLines();
    } else {
      lines = await getLinesByQuery(query);
    }
    handleSuccessfulQuery(res, lines);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const getLine = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const line = await getLineById(+id);
    handleSuccessfulQuery(res, line);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const postLine = async (
  req: AuthorizedRequest<Record<string, never>, NewLine>,
  res: Response,
  next: NextFunction
) => {
  const newLine = req.body;
  try {
    const createdLine = await createLine(newLine);
    handleSuccessfulQuery(res, createdLine, 201);
  } catch (error) {
    handleQueryError(error, "Not created", next);
  }
};

export const putLine = async (
  req: AuthorizedRequest<{ id: string }, NewLine>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newLine = req.body;
  try {
    const replacedLine = await replaceLineById(+id, newLine);
    handleSuccessfulQuery(res, replacedLine);
  } catch (error) {
    handleQueryError(error, "Not updated", next);
  }
};

export const patchLine = async (
  req: AuthorizedRequest<{ id: string }, Partial<NewLine>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const partialLine = req.body;
  try {
    const patchedLine = await patchLineById(+id, partialLine);
    handleSuccessfulQuery(res, patchedLine);
  } catch (error) {
    handleQueryError(error, "Not patched", next);
  }
};

export const deleteLine = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await deleteLineById(+id);
    res.status(204).end();
  } catch (error) {
    handleQueryError(error, "Not deleted", next);
  }
};
