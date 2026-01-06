import { Types, HydratedDocument } from 'mongoose';

export interface IMsg {
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  content: string;
  role: 'system' | 'user' | 'assistant';
}

export type IMsgDoc = HydratedDocument<IMsg> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
