import { Schema, model, models } from 'mongoose';

import type { IMsgDoc } from '../types';

const transform = (_doc: unknown, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

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
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['system', 'user', 'assistant'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { transform },
    toObject: { transform },
  },
);

const MsgModel = models.Message || model<IMsgDoc>('Message', MsgSchema);

export default MsgModel;
