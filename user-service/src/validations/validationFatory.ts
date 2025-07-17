import { ValidationChain } from "express-validator";

import {
  createProfileSchema,
  updateProfileSchema,
  resetPasswordSchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/user": createProfileSchema,
    "/user/:id": updateProfileSchema,
    "/user/:id/reset-password": resetPasswordSchema
  };

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas?.[route];
  }
}
