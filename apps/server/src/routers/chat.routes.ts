import { NextFunction, Request, Response, Router } from 'express';
import { ChatModel, IChatDoc } from '@convoverse/database';
import mongoose from 'mongoose';

import { authorize } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';
import { getLatestDocuments } from '../services/chat.service';
import AppError from '../utils/AppError';

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
 * GET /:id
 * Get single chat (owner only)
 */
router.get(
  '/:id',
  authorize,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Invalid or expired token.', 401));

    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid chat id.', 400));
    }

    const chat = await ChatModel.findOne({
      _id: id,
      createdBy: req.user.id,
      status: { $ne: 'deleted' },
    }).lean<IChatDoc | null>();

    if (!chat) {
      return next(new AppError('Chat not found.', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Chat fetched successfully',
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

/**
 * PATCH /:id
 * Update chat (owner only)
 */
router.patch(
  '/:id',
  authorize,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Invalid or expired token.', 401));

    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid chat id.', 400));
    }

    const { title, pinned, status } = req.body as {
      title?: string;
      pinned?: boolean;
      status?: 'active' | 'archived' | 'deleted';
    };

    const updatePayload: Record<string, unknown> = {};

    if (typeof title === 'string') updatePayload.title = title;
    if (typeof pinned === 'boolean') updatePayload.pinned = pinned;
    if (typeof status === 'string') updatePayload.status = status;

    if (Object.keys(updatePayload).length === 0) {
      return next(new AppError('No valid fields provided for update.', 400));
    }

    const chat = await ChatModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user.id,
        status: { $ne: 'deleted' },
      },
      updatePayload,
      { new: true },
    );

    if (!chat) {
      return next(new AppError('Chat not found.', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
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

/**
 * DELETE /:id
 * Soft delete chat (owner only)
 */
router.delete(
  '/:id',
  authorize,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Invalid or expired token.', 401));

    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid chat id.', 400));
    }

    const chat = await ChatModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user.id,
        status: { $ne: 'deleted' },
      },
      { status: 'deleted' },
      { new: true },
    );

    if (!chat) {
      return next(new AppError('Chat not found.', 404));
    }

    return res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
      data: {
        id: chat._id.toString(),
        status: chat.status,
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
