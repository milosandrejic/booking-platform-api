import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const withValidation = (req: Request, res: Response, next: NextFunction) => {
  // This middleware can be enhanced with specific validation schemas
  // For now, it's a placeholder that passes through
  next();
};
