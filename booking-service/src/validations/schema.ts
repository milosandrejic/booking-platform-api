import {
  ValidationChain,
  checkSchema
} from "express-validator";

export const createBookingSchema: ValidationChain[] = checkSchema({
  propertyId: {
    notEmpty: {
      errorMessage: "Property ID is required"
    },
    isUUID: {
      errorMessage: "Property ID must be a valid UUID"
    }
  },
  startDate: {
    notEmpty: {
      errorMessage: "Start date is required"
    },
    isISO8601: {
      errorMessage: "Start date must be a valid date"
    },
    custom: {
      options: (value) => {
        const startDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
          throw new Error("Start date cannot be in the past");
        }
        return true;
      }
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
  }
});

export const getBookingsSchema: ValidationChain[] = checkSchema({
  userId: {
    optional: true,
    isUUID: {
      errorMessage: "User ID must be a valid UUID"
    }
  },
  propertyId: {
    optional: true,
    isUUID: {
      errorMessage: "Property ID must be a valid UUID"
    }
  }
});

export const getBookingByIdSchema: ValidationChain[] = checkSchema({
  id: {
    in: ['params'],
    isUUID: {
      errorMessage: "Booking ID must be a valid UUID"
    }
  }
});
