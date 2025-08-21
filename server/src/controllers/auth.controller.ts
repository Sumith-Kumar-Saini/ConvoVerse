import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import UserModel from "../models/user.model";
import { generateToken } from "../services/token.service";
import { IUser } from "../types/user";
import { ENV } from "../configs/config";

export async function register(req: Request, res: Response) {
  const {
    email,
    username,
    password,
  }: { email: string; username: string; password: string } =
    req.validatedData?.body || {};

  try {
    const exist = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (exist)
      return res.easyResponse({
        statusCode: 409,
        message: "username or email already exists",
      });

    /* we can check if the user exist or not - if not it will create a user in one go */
    // const user = await UserModel.findOneAndUpdate(
    //   { $or: [{ username }, { email }] }, // Search for user by username or email
    //   { $setOnInsert: { username, email, password: hashedPassword } }, // Only set if inserting
    //   { upsert: true, new: true, runValidators: true } // Insert if not found, return the document
    // );

    const user: IUser = await UserModel.create({
      username,
      email,
      password,
    });

    // we would use JWT ID in future to whitelist the user account
    const { /* JTI, */ refreshToken, accessToken } = generateToken(
      user._id.toString()
    );

    const sanitizedUser = user.removeFields("createdAt updatedAt __v password");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
    });

    return res.easyResponse({
      statusCode: 201,
      message: "User successfully created",
      payload: {
        user: sanitizedUser,
        accessToken,
      },
    });
  } catch (err) {
    return res.easyResponse({
      statusCode: 500,
      message: "Unable to create account at this time",
      error: err as Error,
    });
  }
}

export async function login(req: Request, res: Response) {
  const {
    email,
    username,
    password,
  }: { email?: string; username?: string; password: string } =
    req.validatedData?.body || {};

  const identity = (email || username) as string;

  try {
    const user = await UserModel.findOne<IUser>({
      $or: [{ username: identity }, { email: identity }],
    });

    if (!user)
      return res.easyResponse({
        statusCode: 404,
        message: "No account found with the provided credentials.",
      });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res.easyResponse({
        statusCode: 401,
        message: "Invalid credentials",
      });

    const { /* JTI, */ accessToken, refreshToken } = generateToken(
      user._id.toString()
    );

    const sanitizedUser = user.removeFields("createdAt updatedAt __v password");

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
    });

    return res.easyResponse({
      statusCode: 200,
      message: "Login successful",
      payload: {
        user: sanitizedUser,
        accessToken,
      },
    });
  } catch (err) {
    console.log(err);
    return res.easyResponse({
      statusCode: 500,
      message: "Unable to process login request at this time",
      error: err as Error,
    });
  }
}
