import { Document, Types } from 'mongoose';

export interface IChat {
  createdBy: Types.ObjectId;
  title: string;
  status: 'active' | 'archived';
  lastMessageAt: Date;
  pinned: boolean;
}

export interface IChatDoc extends Document<Types.ObjectId>, IChat {
  removeFields: (_fields: string) => IChatDoc;
}
