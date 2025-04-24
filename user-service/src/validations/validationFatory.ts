import {ValidationChain} from "express-validator";
import _ from "lodash";

import { createProfileSchema } from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string,  ValidationChain[]> = {
    "/user": createProfileSchema
  }

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas[route];
  }
}
