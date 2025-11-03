import { Document, Types } from "mongoose";

export interface IChat extends Document<Types.ObjectId> {
  createdBy: Types.ObjectId;
  title: String;
  status: "active" | "archived";
  lastMessageAt: Date;
  pinned: boolean;
}
