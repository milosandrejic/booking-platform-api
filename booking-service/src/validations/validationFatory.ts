import { ValidationChain } from "express-validator";

import {
  createBookingSchema,
  getBookingsSchema,
  getBookingByIdSchema
} from "src/validations/schema";

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "POST:/bookings": createBookingSchema,
    "GET:/bookings": getBookingsSchema,
    "GET:/bookings/:id": getBookingByIdSchema
  };

  static getValidationSchema(route: string, method: string): ValidationChain[] {
    const key = `${method}:${route}`;
    return this.schemas?.[key];
  }
}
