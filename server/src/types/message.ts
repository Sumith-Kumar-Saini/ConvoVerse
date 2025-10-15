import { Document, Types } from "mongoose";

export interface IMsg extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  chatId: Types.ObjectId;
  content: string;
  role: "system" | "user" | "assistant";
}
