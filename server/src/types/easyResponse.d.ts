import { ERParam } from ".";

export type EasyResponseArray = [EasyResponse | null, Error | undefined];

export interface EasyResponseParameters {
  message: string;
  payload?: object | null;
  error?: Error | null;
}

export type EasyResponseGenerator = (
  ResObjOrCode: number,
  ResObjOrMsg: string | EasyResponseParameters
) => EasyResponseArray;

export type EasyResponseGenerator = (
  ResObjOrCode: ERParam
) => EasyResponseArray;

type EasyResponseFnc = (
  ResObjOrCode: number | ERParam,
  ResObjOrMsg?: string | EasyResponseParameters
) => void;

export { EasyResponseFnc };
