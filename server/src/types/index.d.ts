import ApiResponse from "../middlewares/easyResponse";
export * from "./express";

export interface GenerateResponseParam {
  statusCode: number;
  message: string;
  payload: object | null;
  error: Error | null;
  originalUrl: string;
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

type easyResponse = (param: ERParam) => void;
