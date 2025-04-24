import {
  Request,
  Response,
  NextFunction
} from "express"

import {validationResult} from "express-validator"

import _ from "lodash";

export const withValidation = async (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).send({
      message: "Validation failed",
      errors: result.array()
    })
  }

  next();
}