import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserDoc } from '../types';

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
