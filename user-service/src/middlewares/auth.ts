import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";

import { authRepository } from "src/repositories";

type DecodedJwtToken = {
  id: string;
  email: string;
  role: string;
};

type DecodedInternalJwtToken = {
  service: string;
};

const decodeToken = <T>(token: string): T => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as T;
};

export const withAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken: DecodedJwtToken;

  try {
    decodedToken = decodeToken<DecodedJwtToken>(token);
  } catch {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  if (!decodedToken) {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  const auth = await authRepository.findOneBy({ id: decodedToken.id });

  if (!auth) {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  req.auth = auth;

  next();
};

export const withInternalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.["x-authorization"] as string;
  const serviceNameHeader = req.headers?.["x-service-name"] as string;

  if (!authHeader || !authHeader.startsWith("Bearer ") || !serviceNameHeader) {
    res.status(401).send({
      error: "Unauthorized."
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken: DecodedInternalJwtToken;

  try {
    decodedToken = decodeToken<DecodedInternalJwtToken>(token);
  } catch {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  if (decodedToken?.service !== serviceNameHeader) {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  next();
};
