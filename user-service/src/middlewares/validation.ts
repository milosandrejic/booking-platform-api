import {
  Request,
  Response,
  NextFunction
} from "express";

import { validationResult, ResultFactory } from "express-validator";

import { ValidationFactory } from "src/validations/validationFatory";

const validationResultHandler: ResultFactory<string> = validationResult.withDefaults({ formatter: error => error.msg });

export const withValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validators = ValidationFactory.getValidationSchema(req.route.path);

  if (validators) {
    await Promise.all(validators.map(v => v.run(req)));

    const result = validationResultHandler(req);

    if (!result.isEmpty()) {
      res.status(400).send({
        message: "Validation failed",
        errors: result.mapped()
      });

      return;
    }
  }

  next();
};
