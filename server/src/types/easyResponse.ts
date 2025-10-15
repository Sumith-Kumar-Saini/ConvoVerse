export type EasyResponseArray = [EasyResponse | null, Error | undefined];

export interface EasyResponseParameters {
  message: string;
  payload?: object | null;
  error?: Error | null;
}

export type EasyResponseGenerator = {
  (ResObjOrCode: number, ResObjOrMsg: string): EasyResponseArray;
  (
    ResObjOrCode: number,
    ResObjOrMsg: EasyResponseParameters
  ): EasyResponseArray;
  (ResObjOrCode: ERParam): EasyResponseArray;
};

export type EasyResponseFnc = {
  (ResObjOrCode: number, ResObjOrMsg: string): void;
  (ResObjOrCode: number, ResObjOrMsg: EasyResponseParameters): void;
  (ResObjOrCode: ERParam): void;
};

export interface GenerateResponseParam {
  statusCode: number;
  message: string;
  payload: object | null;
  error: Error | null;
}

export interface EasyResponse {
  statusCode: number;
  status: string;
  error: Error | null;
  message: string;
  payload: object | null;
  path: string;
  timeStamp: string;
}

export interface ERParam {
  statusCode: number;
  message: string;
  payload?: object | null;
  error?: Error | null;
}
