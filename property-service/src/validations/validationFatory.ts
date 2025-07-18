import { ValidationChain } from "express-validator";

import {
  createPropertyReviewSchema,
  createPropertySchema,
  createPropertyPricingSchema,
  createSeasonalPricingSchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/property": createPropertySchema,
    "/property/review": createPropertyReviewSchema,
    "/properties/:propertyId/pricing": createPropertyPricingSchema,
    "/properties/:propertyId/seasonal-pricing": createSeasonalPricingSchema
  };

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas?.[route];
  }
}
