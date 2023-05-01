import Model from "./Model";

type JSONResponse<Z extends string, T extends Model<Z> | Model<Z>[]> = {
  success: boolean;
  data: T;
};

export type JSONFailResponse = {
  success: false;
  errors: string[];
};

export default JSONResponse;
