import { ValidationChain } from "express-validator";

import {
  createPropertyReviewSchema,
  createPropertySchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/property": createPropertySchema,
    "/property/review": createPropertyReviewSchema
  };

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas?.[route];
  }
}
