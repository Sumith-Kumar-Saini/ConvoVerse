import { Document, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  username: string;
  email: string;
  password: string;
  removeFields: (_fields: string) => IUser;
}
