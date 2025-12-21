import mongoose, { Schema, model } from 'mongoose';

import { IMsgDoc } from '../types';

const MsgSchema = new Schema<IMsgDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    role: { type: String, enum: ['system', 'user', 'assistant'] },
  },
  {
    timestamps: true,
  },
);

MsgSchema.methods.removeFields = function (_fields: string) {
  const chat = this.toObject();
  const fields = _fields.split(' ');
  fields.forEach((field) => {
    delete chat[field];
  });
  return chat;
};

const MsgModel = mongoose.models.Message || model<IMsgDoc>('Message', MsgSchema);

export default MsgModel;
