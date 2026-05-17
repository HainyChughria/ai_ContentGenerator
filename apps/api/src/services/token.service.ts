import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  userId: string;
};

export const generateAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.jwtAccessSecret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
};
