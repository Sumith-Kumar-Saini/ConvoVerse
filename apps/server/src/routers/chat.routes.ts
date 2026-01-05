import { NextFunction, Request, Response, Router } from 'express';
import { ChatModel, IChatDoc } from '@convoverse/database';
import mongoose from 'mongoose';

import { authorize } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { getLatestDocuments } from '../services/chat.service';
import AppError from '../utils/AppError';
// import { IChat } from '../types';

const router = Router();

router.post(
  '/',
  authorize,
  catchAsync(async (req: Request, res: Response) => {
    const { title = 'Untitled' } = (req.body || {}) as { title?: string };

    const user = req.user;
    const ownerId = new mongoose.Types.ObjectId(user?.id);

    const chat = (await ChatModel.create({ createdBy: ownerId, title })) as IChatDoc;

    return res.status(201).json({
      success: true,
      message: 'Chat has been created!',
      data: {
        id: chat._id.toString(),
        title: chat.title,
        status: chat.status,
        pinned: chat.pinned,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  }),
);

router.get(
  '/list',
  authorize,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Invalid or expired token.', 401));

    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '10'), 10);

    const chats = await getLatestDocuments({ page, limit, createdBy: req.user.id });

    return res.status(200).json({
      success: true,
      message: 'Chats fetched successfully',
      data: chats,
      meta: {
        page,
        limit,
        count: chats.length,
      },
    });
  }),
);

/**
"chat": {
      "createdBy": "68a6ed1e5f7e6d2a4726b3e6",              -- Main
      "title": "Untitled",                                  -- Main
      "status": "active",                                   -- Main
      "pinned": false,                                      -- Main
      ----    ----    ----    ----    ----    ----    ----    ----
      "_id": "69086331bcdff29b7568f25c",                    -- MDATA
      "createdAt": "2025-11-03T08:09:21.704Z",              -- MDATA
      "updatedAt": "2025-11-03T08:09:21.704Z",              -- MDATA
      ----    ----    ----    ----    ----    ----    ----    ----
      "__v": 0                                              -- X
   }
 */

export default router;
