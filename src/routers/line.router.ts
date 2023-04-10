import { newLineSchema } from "../types/Line";
import createStandardRouter from "./standard.router";

const linesRouter = createStandardRouter("Line", newLineSchema);

export default linesRouter;
