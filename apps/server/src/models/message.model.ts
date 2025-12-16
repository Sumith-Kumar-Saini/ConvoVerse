import mongoose, { Schema, model } from "mongoose";

import { IMsg } from "../types";

const MsgSchema = new Schema<IMsg>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    role: { type: String, enum: ["system", "user", "assistant"] },
  },
  {
    timestamps: true,
  }
);

const MsgModel = mongoose.models.Message || model<IMsg>("Message", MsgSchema);

export default MsgModel;
