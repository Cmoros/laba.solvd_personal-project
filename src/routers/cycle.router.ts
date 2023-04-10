import { newCycleSchema } from "../types/Cycle";
import createStandardRouter from "./standard.router";

const cyclesRouter = createStandardRouter("Cycle", newCycleSchema);

export default cyclesRouter;
