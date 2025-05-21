import {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";
import { Auth } from "src/model";

import { authRepository } from "src/repositories";

type DecodedJwtToken = {
  id: string;
  email: string;
  role: string;
};

const resolveAuth = async (access_token: string): Promise<Auth | null> => {
  if (!access_token) {
    return null;
  }

  try {
    const decodedToken = jwt.verify(access_token, process.env.JWT_SECRET as string) as DecodedJwtToken;
    const auth = await authRepository.findOneBy({ id: decodedToken.id });

    return auth;
  } catch {
    return null;
  }
};

export const withAuth = async (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.headers.authorization ?? "";

  const auth = await resolveAuth(access_token);

  if (!auth) {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }

  req.auth = auth;

  next();
};

export { resolveAuth };
