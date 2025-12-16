import mongoose, { Schema, model } from "mongoose";

import { IChat } from "../types";

const ChatSchema = new Schema<IChat>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Basic info
    title: { type: String, default: "Untitled" }, // user-editable title
    status: { type: String, enum: ["active", "archived"], default: "active" },

    // Quick metadata
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Method to remove specific fields dynamically
ChatSchema.methods.removeFields = function (_fields: string) {
  const chat = this.toObject();
  const fields = _fields.split(" ");
  fields.forEach((field) => {
    delete chat[field]; // Dynamically remove the fields from the user object
  });
  return chat;
};

const ChatModel = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

export default ChatModel;
