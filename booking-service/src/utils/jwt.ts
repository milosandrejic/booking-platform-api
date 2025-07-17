import jwt from "jsonwebtoken";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "24h"
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
};
