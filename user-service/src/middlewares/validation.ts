import {
  Request,
  Response,
  NextFunction
} from "express"

import { ValidationFactory } from "src/validations/validationFatory";

export const withValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validator = ValidationFactory.getValidationSchema(req.route.path);

  return;
}