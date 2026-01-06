import { Types, HydratedDocument } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export type IUserDoc = HydratedDocument<IUser> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
