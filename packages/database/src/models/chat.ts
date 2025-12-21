import mongoose, { Schema, model } from 'mongoose';

import { IChatDoc } from '../types';

const ChatSchema = new Schema<IChatDoc>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: { type: String, default: 'Untitled' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },

    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

ChatSchema.methods.removeFields = function (_fields: string) {
  const chat = this.toObject();
  const fields = _fields.split(' ');
  fields.forEach((field) => {
    delete chat[field];
  });
  return chat;
};

export const ChatModel = mongoose.models?.Chat || model<IChatDoc>('Chat', ChatSchema);
