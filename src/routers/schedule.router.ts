import Schedule, { newScheduleSchema } from "../types/Schedule";
import createStandardRouter from "./standard.router";

const schedulesRouter = createStandardRouter<Schedule, "Schedule">(
  "Schedule",
  newScheduleSchema
);

export default schedulesRouter;
