import Model from "./Model";

type JSONResponse<T extends Model | Model[]> = {
  success: boolean;
  data: T;
};

export type JSONFailResponse = {
  success: false;
  errors: string[];
};

export default JSONResponse;
