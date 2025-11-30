import { ValidationChain } from "express-validator";

import {
  createProfileSchema,
  updateProfileSchema,
  resetPasswordSchema,
  loginSchema,
  refreshTokenSchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/login": loginSchema,
    "/refresh": refreshTokenSchema,
    "/user": createProfileSchema,
    "/user/:id": updateProfileSchema,
    "/user/:id/reset-password": resetPasswordSchema
  };

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas?.[route];
  }
}
