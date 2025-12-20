import { Document, Types } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface IUserDoc extends Document<Types.ObjectId>, IUser {
  removeFields: (_fields: string) => IUserDoc | IUser;
}
