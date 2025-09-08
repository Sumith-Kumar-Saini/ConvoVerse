import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { ENV } from "../configs/config";
import { IUser } from "../types";

const { BCRYPT_SALT_ROUNDS: SALT_ROUNDS } = ENV;

const UserSchema = new Schema<IUser>(
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
  {
    timestamps: true,
  }
);

// Pre-save hook for hashing
UserSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to remove specific fields dynamically
UserSchema.methods.removeFields = function (_fields: string) {
  const user = this.toObject();
  const fields = _fields.split(" ");
  fields.forEach((field) => {
    delete user[field]; // Dynamically remove the fields from the user object
  });
  return user;
};

// Custom toJSON method to exclude password by default
UserSchema.methods.toJSON = function () {
  const user = this.removeFields("password");
  return user;
};

const UserModel = mongoose.models.User || model<IUser>("User", UserSchema);

export default UserModel;
