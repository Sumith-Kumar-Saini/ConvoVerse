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
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const ChatModel = mongoose.models?.Chat || model<IChatDoc>('Chat', ChatSchema);
