import { newTrainSchema } from "../types/Train";
import createStandardRouter from "./standard.router";

const trainsRouter = createStandardRouter("Train", newTrainSchema);

export default trainsRouter;
