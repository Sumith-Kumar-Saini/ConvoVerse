import { Router } from 'express';

import { authorize } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { createAndStreamMessage } from '../controllers/message.controller';

const router = Router({ mergeParams: true });

router.post('/', authorize, catchAsync(createAndStreamMessage));

export default router;
