import { ChatModel } from '@convoverse/database';
import { Types } from 'mongoose';

interface PaginationParams {
  page?: number;
  limit?: number;
  createdBy: string | Types.ObjectId;
}

export interface ChatResponseDTO {
  id: string;
  title: string;
  pinned: boolean;
  status: 'active' | 'archived';
  updatedAt: Date;
}

export async function getLatestDocuments({
  page = 1,
  limit = 10,
  createdBy,
}: PaginationParams): Promise<ChatResponseDTO[]> {
  const skip = (page - 1) * limit;

  const documents = await ChatModel.find(
    { createdBy, status: 'active' },
    { title: 1, pinned: 1, updatedAt: 1, status: 1 },
  )
    .sort({ pinned: -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return documents.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    pinned: doc.pinned,
    status: doc.status,
    updatedAt: doc.updatedAt,
  }));
}
