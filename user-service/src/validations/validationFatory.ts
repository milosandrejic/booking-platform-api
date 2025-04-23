import {
  checkSchema,
  ValidationChain,
} from "express-validator";
import _ from "lodash";
import { Gender } from "src/model";

// email,
// first_name,
// last_name,
// display_name,
// phone_number,
// date_of_birth,
// nationality,
// gender

export class ValidationFactory {
  private static readonly schemas: Record<string, ValidationChain[]> = {
    "/user": checkSchema({
      email: {
        isEmail: true,
        notEmpty: true,
      },
      first_name: {
        isString: true,
        notEmpty: true
      },
      last_name: {
        isString: true,
        notEmpty: true
      },
      display_name: {
        optional: true,
        isString: true,
        isLength: {
          errorMessage: "Display name must be at least 5 characters long",
          options: {
            min: 5
          }
        }
      },
      phone_number: {
        isMobilePhone: true,
        notEmpty: true
      },
      date_of_brith: {
        isDate: true,
      },
      nationality: {
        isString: true,
        notEmpty: true
      },
      gender: {
        notEmpty: true,
        isIn: {
          options: [Gender.MALE, Gender.FEMALE],
          errorMessage: "Gender must be male or female"
        }
      }
    })
  }

  static getValidationSchema(route: string): ValidationChain[] {
    return this.schemas[route];
  }
}
