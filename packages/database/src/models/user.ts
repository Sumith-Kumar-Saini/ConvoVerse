import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUserDoc } from '../types';

const SALT_ROUNDS = 10;

const UserSchema = new Schema<IUserDoc>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUserDoc>('save', async function () {
  if (!this.password) return;
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.removeFields = function (_fields: string) {
  const user = this.toObject();
  const fields = _fields.split(' ');
  fields.forEach((field) => {
    delete user[field];
  });
  return user;
};

UserSchema.methods.toJSON = function () {
  const user = this.removeFields('password');
  return user;
};

export const UserModel = mongoose.models.User || model<IUserDoc>('User', UserSchema);
