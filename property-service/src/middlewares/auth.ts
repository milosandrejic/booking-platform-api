import {
  Request,
  Response,
  NextFunction
} from "express";

import userServiceApi from "src/utils/api";

const resolveAuth = async (accessToken: string): Promise<string | null> => {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await userServiceApi.post<{ id: string }>("/internal-auth");

    return response.data.id;
  } catch {
    return null;
  }
};

export const withAuth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization ?? "";

  if (!accessToken) {
    res.status(401).send({
      error: "Unauthorized"
    });

    return;
  }

  try {
    const response = await userServiceApi.post<{ id: string }>("/internal-auth", {}, {
      headers: {
        Authorization: accessToken
      }
    });

    const userId = response.data.id;

    req.userId = userId;

    next();
  } catch {
    res.status(401).send({
      error: "Unauthorized."
    });

    return;
  }
};

export { resolveAuth };
