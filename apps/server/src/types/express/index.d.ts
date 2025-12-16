import { ValidatedData, EasyResponseFnc as EasyResponse } from '..';

declare global {
  namespace Express {
    interface Request {
      validatedData?: ValidatedData;
    }

    interface Response {
      easyResponse: EasyResponse;
    }
  }
}
