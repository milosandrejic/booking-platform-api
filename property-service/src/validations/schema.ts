import {
  ValidationChain,
  checkSchema
} from "express-validator";

import PropertyType from "src/types/propertyType";

export const createPropertySchema: ValidationChain[] = checkSchema({
  ownerId: {
    notEmpty: {
      errorMessage: "Owner ID is required"
    },
    isUUID: {
      errorMessage: "Owner ID must be a valid UUID"
    }
  },
  title: {
    notEmpty: {
      errorMessage: "Title is required"
    },
    isString: {
      errorMessage: "Title should be text"
    }
  },
  description: {
    notEmpty: {
      errorMessage: "Description is required"
    },
    isString: {
      errorMessage: "Description should be text"
    }
  },
  price: {
    notEmpty: {
      errorMessage: "Price is required"
    },
    isNumeric: {
      errorMessage: "Price must be a number"
    }
  },
  type: {
    notEmpty: {
      errorMessage: "Property type is required"
    },
    isIn: {
      options: [Object.values(PropertyType)],
      errorMessage: "Property type can be one of pre-determined types"
    }
  },
  location: {
    custom: {
      options: (value) => {
        if (typeof value !== "object" || value === null) {
          throw new Error("location must be an object");
        }
        if (value.type !== "Point") {
          throw new Error("location.type must be 'Point'");
        }
        if (
          !Array.isArray(value.coordinates) ||
          value.coordinates.length !== 2
        ) {
          throw new Error("location.coordinates must be an array of [longitude, latitude]");
        }
        const [lng, lat] = value.coordinates;
        if (
          typeof lng !== "number" ||
          typeof lat !== "number" ||
          lng < -180 ||
          lng > 180 ||
          lat < -90 ||
          lat > 90
        ) {
          throw new Error("Invalid longitude or latitude values");
        }
        return true;
      }
    }
  },
  addressLine: {
    notEmpty: {
      errorMessage: "Address line is required"
    },
    isString: {
      errorMessage: "Address line should be text"
    }
  },
  city: {
    notEmpty: {
      errorMessage: "City is required"
    },
    isString: {
      errorMessage: "City should be text"
    }
  },
  state: {
    notEmpty: {
      errorMessage: "State is required"
    },
    isString: {
      errorMessage: "State should be text"
    }
  },
  postalCode: {
    notEmpty: {
      errorMessage: "Postal code is required"
    },
    isString: {
      errorMessage: "Postal code should be text"
    }
  },
  country: {
    notEmpty: {
      errorMessage: "Country is required"
    },
    isString: {
      errorMessage: "Country should be text"
    }
  },
  facilities: {
    optional: true,
    isArray: {
      errorMessage: "Facilities must be an array"
    }
  }
});

export const createPropertyReviewSchema: ValidationChain[] = checkSchema({
  propertyId: {
    notEmpty: {
      errorMessage: "Property ID is required"
    },
    isUUID: {
      errorMessage: "Property ID must be a valid UUID"
    }
  },
  userId: {
    notEmpty: {
      errorMessage: "User ID is required"
    },
    isUUID: {
      errorMessage: "User ID must be a valid UUID"
    }
  },
  rating: {
    notEmpty: {
      errorMessage: "Rating is required"
    },
    isInt: {
      options: {
        min: 1,
        max: 5
      },
      errorMessage: "Rating must be an integer between 1 and 5"
    }
  },
  comment: {
    notEmpty: {
      errorMessage: "Comment is required"
    },
    isString: {
      errorMessage: "Comment must be a string"
    }
  }
});

export const createPropertyPricingSchema: ValidationChain[] = checkSchema({
  basePricePerNight: {
    notEmpty: {
      errorMessage: "Base price per night is required"
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Base price per night must be a positive number"
    }
  },
  weekendPrice: {
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "Weekend price must be a positive number"
    }
  },
  cleaningFee: {
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "Cleaning fee must be a positive number"
    }
  },
  serviceFeePercent: {
    optional: true,
    isFloat: {
      options: {
        min: 0,
        max: 100
      },
      errorMessage: "Service fee percent must be between 0 and 100"
    }
  },
  currency: {
    optional: true,
    isLength: {
      options: {
        min: 3,
        max: 3
      },
      errorMessage: "Currency must be a 3-letter code"
    },
    isString: {
      errorMessage: "Currency must be a string"
    }
  }
});

export const createSeasonalPricingSchema: ValidationChain[] = checkSchema({
  startDate: {
    notEmpty: {
      errorMessage: "Start date is required"
    },
    isISO8601: {
      errorMessage: "Start date must be a valid date"
    }
  },
  endDate: {
    notEmpty: {
      errorMessage: "End date is required"
    },
    isISO8601: {
      errorMessage: "End date must be a valid date"
    },
    custom: {
      options: (value, { req }) => {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
        
        if (endDate <= startDate) {
          throw new Error("End date must be after start date");
        }
        return true;
      }
    }
  },
  pricePerNight: {
    notEmpty: {
      errorMessage: "Price per night is required"
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price per night must be a positive number"
    }
  }
});

