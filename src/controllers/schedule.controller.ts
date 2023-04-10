import { NextFunction, Response } from "express";
import {
  createSchedule,
  deleteScheduleById,
  getAllSchedules,
  getScheduleById,
  getSchedulesByQuery,
  patchScheduleById,
  replaceScheduleById,
} from "../models/schedule.model";
import { AuthorizedRequest } from "../types/CustomRequest";
import Schedule, { NewSchedule } from "../types/Schedule";
import { EmptyObject, checkIsEmptyObject } from "../types/utils";
import { QueryParams } from "../types/Auth";
import { handleQueryError, handleSuccessfulQuery } from "./utils";

// TODO Old Code, delete later

export const getSchedules = async (
  req: AuthorizedRequest<EmptyObject, EmptyObject, QueryParams<Schedule>>,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  let schedules: Schedule[];
  try {
    if (checkIsEmptyObject(query)) {
      schedules = await getAllSchedules();
    } else {
      schedules = await getSchedulesByQuery(query);
    }
    handleSuccessfulQuery(res, schedules);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const getSchedule = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const schedule = await getScheduleById(+id);
    handleSuccessfulQuery(res, schedule);
  } catch (error: unknown) {
    handleQueryError(error, "Not found", next);
  }
};

export const postSchedule = async (
  req: AuthorizedRequest<Record<string, never>, NewSchedule>,
  res: Response,
  next: NextFunction
) => {
  const newSchedule = req.body;
  try {
    const createdSchedule = await createSchedule(newSchedule);
    handleSuccessfulQuery(res, createdSchedule, 201);
  } catch (error) {
    handleQueryError(error, "Not created", next);
  }
};

export const putSchedule = async (
  req: AuthorizedRequest<{ id: string }, NewSchedule>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const newSchedule = req.body;
  try {
    const replacedSchedule = await replaceScheduleById(+id, newSchedule);
    handleSuccessfulQuery(res, replacedSchedule);
  } catch (error) {
    handleQueryError(error, "Not updated", next);
  }
};

export const patchSchedule = async (
  req: AuthorizedRequest<{ id: string }, Partial<NewSchedule>>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const partialSchedule = req.body;
  try {
    const patchedSchedule = await patchScheduleById(+id, partialSchedule);
    handleSuccessfulQuery(res, patchedSchedule);
  } catch (error) {
    handleQueryError(error, "Not patched", next);
  }
};

export const deleteSchedule = async (
  req: AuthorizedRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await deleteScheduleById(+id);
    res.status(204).end();
  } catch (error) {
    handleQueryError(error, "Not deleted", next);
  }
};
