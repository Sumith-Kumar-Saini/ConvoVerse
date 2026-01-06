import { Types, HydratedDocument } from 'mongoose';

export interface IChat {
  createdBy: Types.ObjectId;
  title: string;
  status: 'active' | 'archived';
  pinned: boolean;
}

export type IChatDoc = HydratedDocument<IChat> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
