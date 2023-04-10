import { newScheduleSchema } from "../types/Schedule";
import createStandardRouter from "./standard.router";

const schedulesRouter = createStandardRouter("Schedule", newScheduleSchema);

export default schedulesRouter;
