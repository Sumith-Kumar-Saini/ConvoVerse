import { ValidatedData, EasyResponseFnc as EasyResponse } from '..';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
      validatedData?: ValidatedData;
    }

    interface Response {
      easyResponse: EasyResponse;
    }
  }
}
