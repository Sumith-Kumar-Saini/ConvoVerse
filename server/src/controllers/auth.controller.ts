import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model";
import { generateToken } from "../services/token.service";
import { IUser } from "../types";
import { ENV } from "../configs/env";

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

export async function refresh(req: Request, res: Response) {
  const token: string | undefined = req.cookies?.refreshToken;

  if (!token)
    return res.easyResponse({
      statusCode: 400,
      message: "Refresh token is missing or invalid.",
    });

  try {
    const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId);

    if (!user)
      return res.easyResponse({
        statusCode: 401,
        message: "User not found, please log in again.",
      });

    const { accessToken, refreshToken } = generateToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: ENV.NODE_ENV === "production", // Use secure cookies in production
    });

    return res.easyResponse({
      statusCode: 200,
      message: "Tokens refreshed successfully.",
      payload: {
        accessToken,
      },
    });
  } catch (err) {
    return res.easyResponse({
      statusCode: 401,
      message: "Invalid or expired refresh token.",
      error: err as Error,
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken");
  /* In future, we have to remove JTI from whiteList in redis */
  res.easyResponse({
    statusCode: 200,
    message: "User successfully logged out",
  });
}
