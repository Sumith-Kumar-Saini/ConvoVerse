import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ChatModel } from '@convoverse/database';
import { streamText } from 'ai';
import { MsgModel } from '@convoverse/database';

import { google } from '../configs/google-llm';
import AppError from '../utils/AppError';

export const createAndStreamMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { chatId } = req.params as { chatId: string };
  const { content } = req.body;
  const userId = req?.user?.id;

  if (!mongoose.Types.ObjectId.isValid(chatId)) return next(new AppError('Invalid chatId', 400));

  if (!content || typeof content !== 'string')
    return next(new AppError('Message content is required', 400));

  const chat = await ChatModel.exists({
    _id: chatId,
    createdBy: userId,
    status: 'active',
  });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  await MsgModel.create({
    userId,
    chatId,
    content,
    role: 'user',
  });

  const previousMessages = await MsgModel.find({ chatId })
    .sort({ createdAt: 1 })
    .select('role content -_id')
    .lean();

  res.status(200);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let assistantContent = '';

  const stream = streamText({
    model: google('gemini-2.5-flash-lite'),
    messages: previousMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  try {
    for await (const chunk of stream.textStream) {
      assistantContent += chunk;
      res.write(chunk);
    }

    await MsgModel.create({
      userId,
      chatId,
      content: assistantContent,
      role: 'assistant',
    });

    return res.end();
  } catch (error) {
    res.end();
    throw error;
  }
};
