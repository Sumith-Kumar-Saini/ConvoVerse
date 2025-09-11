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
    autoTitle: { type: String }, // AI-generated quick title
    status: { type: String, enum: ["active", "archived"], default: "active" },

    // Linking with messages
    lastMessageAt: { type: Date },

    // model: {
    //   provider: { type: String, default: "google" },
    //   modelId: { type: String, default: "google/gemini-1.5-pro" },
    //   temperature: { type: Number, default: 0.7 },
    //   maxTokens: { type: Number, default: 2048 },
    // },

    // Quick metadata
    tags: [{ type: String }],
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.models.Chat || model<IChat>("Chat", ChatSchema);

export default ChatModel;
