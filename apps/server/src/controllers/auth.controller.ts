import { NextFunction, Request, Response } from 'express';
import { IUserDoc, UserModel } from '@convoverse/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import z from 'zod';

import type { loginSchema, registerSchema } from '../schemas';
import { generateToken } from '../services/token.service';
import AppError from '../utils/AppError';
import { ENV } from '../configs/env';

export async function register(req: Request, res: Response, next: NextFunction) {
  type RegisterBody = z.infer<typeof registerSchema>['body'];
  const { email, username, password } = req.validatedData?.body as RegisterBody;

  try {
    const exist = await UserModel.exists({ $or: [{ username }, { email }] });
    if (exist) return next(new AppError('username or email already exists', 409));

    /* we can check if the user exist or not - if not it will create a user in one go */
    // const user = await UserModel.findOneAndUpdate(
    //   { $or: [{ username }, { email }] }, // Search for user by username or email
    //   { $setOnInsert: { username, email, password: hashedPassword } }, // Only set if inserting
    //   { upsert: true, new: true, runValidators: true } // Insert if not found, return the document
    // );

    const user: IUserDoc = await UserModel.create({
      username,
      email,
      password,
    });

    // we would use JWT ID in future to whitelist the user account
    const { /* JTI, */ refreshToken, accessToken } = generateToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
    });

    return res.status(201).json({
      message: 'User successfully created',
      payload: {
        user: user.toJSON(),
        accessToken,
      },
    });
  } catch (err) {
    next(
      new AppError('Unable to create account at this time', 500, {
        cause: err as Error,
      }),
    );
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  type LoginBody = z.infer<typeof loginSchema>['body'];
  const { email, username, password } = req.validatedData?.body as LoginBody;

  const identifier = (email || username) as string;

  try {
    const user = await UserModel.findOne<IUserDoc>({
      $or: [{ username: identifier }, { email: identifier }],
    }).select('+password');

    if (!user) return next(new AppError('No account found with the provided credentials.', 404));
    if (!user.password) return next(new AppError('Authentication configuration error', 500));

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return next(new AppError('Invalid credentials', 401));

    const { /* JTI, */ accessToken, refreshToken } = generateToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Login successful',
      payload: {
        user: user.toJSON(),
        accessToken,
      },
    });
  } catch (err) {
    next(
      new AppError('Unable to process login request at this time', 500, {
        cause: err as Error,
      }),
    );
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.cookies?.refreshToken;

  if (!token)
    return res.status(400).json({
      message: 'Refresh token is missing or invalid.',
    });

  try {
    const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as {
      id: string;
    };

    const user = await UserModel.findById(decoded.id);

    if (!user)
      return res.status(401).json({
        message: 'User not found, please log in again.',
      });

    const { accessToken, refreshToken } = generateToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production', // Use secure cookies in production
    });

    return res.status(200).json({
      message: 'Tokens refreshed successfully.',
      payload: {
        accessToken,
      },
    });
  } catch (err) {
    return next(
      new AppError('Invalid or expired refresh token.', 401, {
        cause: err as Error,
      }),
    );
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken');
  /* In future, we have to remove JTI from whiteList in redis */
  return res.status(200).json({
    message: 'User successfully logged out',
  });
}
