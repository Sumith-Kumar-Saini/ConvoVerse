export type EasyResponseArray = [EasyResponse | null, Error | undefined];

export type EasyResponseGenerator = (
  ResObjOrCode: number | ERParam,
  ResObjOrMsg?: string | EasyResponseParameters
) => EasyResponseFuc;

export type EasyResponseFnc = (
  ResObjOrCode: number | ERParam,
  ResObjOrMsg?: string | EasyResponseParameters
) => void;
