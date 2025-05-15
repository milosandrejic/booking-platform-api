import { ValidationChain } from "express-validator";

import {
  createProfileSchema,
  updateProfileSchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/user": createProfileSchema,
    "/user/:id": updateProfileSchema
  };

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas?.[route];
  }
}
