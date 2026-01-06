import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

import type { IUserDoc } from '../types';

const SALT_ROUNDS = 10;

const transform = (_doc: unknown, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  return ret;
};

const UserSchema = new Schema<IUserDoc>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { transform },
    toObject: { transform },
  },
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel = models.User || model<IUserDoc>('User', UserSchema);
