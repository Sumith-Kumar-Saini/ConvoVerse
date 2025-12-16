import { Request, Response, Router } from "express";
import mongoose from "mongoose";

import { authorize } from "../middlewares/auth.middleware";
import ChatModel from "../models/chat.model";
import { catchAsync } from "../utils/catchAsync";
import { IChat } from "../types";

const router = Router();

router.post(
  "/",
  authorize,
  catchAsync(async (req: Request, res: Response) => {
    const { title = "Untitled" } = (req.body || {}) as { title?: string };

    const user = (req as any).user as { id: string };
    const ownerId = new mongoose.Types.ObjectId(user.id);

    const chat = await ChatModel.create<IChat>({ createdBy: ownerId, title });

    return res
      .status(200)
      .json({ message: "Chat has been created!", payload: { chat } });
  })
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
