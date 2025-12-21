import { Document, Types } from 'mongoose';

export interface IMsg {
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  content: string;
  role: 'system' | 'user' | 'assistant';
}

export interface IMsgDoc extends Document<Types.ObjectId>, IMsg {
  removeFields: (_fields: string) => IMsgDoc;
}
