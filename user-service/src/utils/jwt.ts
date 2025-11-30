import jwt from "jsonwebtoken";
import { Role } from "src/model";

interface AccessTokenPayload {
  id: string;
  email: string;
  role: Role;
  type: "access";
}

interface RefreshTokenPayload {
  id: string;
  tokenVersion: number;
  type: "refresh";
}

export interface DecodedAccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export interface DecodedRefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

/**
 * Generate a short-lived access token (15 minutes)
 */
export const generateAccessToken = (id: string, email: string, role: Role): string => {
  const payload: AccessTokenPayload = {
    id,
    email,
    role,
    type: "access"
  };

  const options: jwt.SignOptions = {
    expiresIn: "15m"
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    options
  );
};

/**
 * Generate a long-lived refresh token (7 days)
 */
export const generateRefreshToken = (id: string, tokenVersion: number): string => {
  const payload: RefreshTokenPayload = {
    id,
    tokenVersion,
    type: "refresh"
  };

  const options: jwt.SignOptions = {
    expiresIn: "7d"
  };

  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    options
  );
};

/**
 * Verify and decode a refresh token
 */
export const verifyRefreshToken = (token: string): DecodedRefreshToken => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodedRefreshToken;

    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Verify and decode an access token
 */
export const verifyAccessToken = (token: string): DecodedAccessToken => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedAccessToken;

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch {
    throw new Error("Invalid or expired access token");
  }
};
