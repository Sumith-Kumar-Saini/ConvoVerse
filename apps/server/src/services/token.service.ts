import crypto from 'node:crypto';

import JWT from 'jsonwebtoken';

import { ENV } from '../configs/env';

const generateAccessToken = (payload: Record<string, any>) => {
  const token = JWT.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  return token;
};

const generateRefreshToken = (payload: Record<string, any>) => {
  const token = JWT.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return token;
};

export const generateToken = (userId: string) => {
  const JTI = crypto.randomUUID();
  const payload = { id: userId, JTI };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken, JTI };
};
