import { newStationSchema } from "../types/Station";
import createStandardRouter from "./standard.router";

const stationsRouter = createStandardRouter("Station", newStationSchema);

export default stationsRouter;
