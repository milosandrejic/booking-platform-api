import {
  ValidationChain,
  checkSchema
} from "express-validator";
import { Gender } from "src/model";

export const createProfileSchema: ValidationChain[] = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required"
    },
    isEmail: {
      errorMessage: "Email is in wrong format"
    }
  },
  first_name: {
    notEmpty: {
      errorMessage: "First name is required"
    },
    isString: {
      errorMessage: "First name should be text"
    }
  },
  last_name: {
    notEmpty: {
      errorMessage: "Last name is required"
    },
    isString: {
      errorMessage: "Last name should be text"
    }
  },
  display_name: {
    optional: true,
    isLength: {
      errorMessage: "Display name must be at least 5 characters long",
      options: {
        min: 5
      }
    }
  },
  phone_number: {
    notEmpty: {
      errorMessage: "Mobile phone is required"
    },
    isMobilePhone: {
      errorMessage: "Phone number is in wrong format"
    }
  },
  date_of_birth: {
    isDate: {
      errorMessage: "Date is invalid"
    }
  },
  nationality: {
    notEmpty: {
      errorMessage: "Nationality is required"
    },
    isString: {
      errorMessage: "Nationality should be text"
    }
  },
  gender: {
    notEmpty: {
      errorMessage: "Gender is required"
    },
    isIn: {
      options: [Gender.MALE, Gender.FEMALE],
      errorMessage: "Gender must be male or female"
    }
  }
});

export const updateProfileSchema: ValidationChain[] = checkSchema({
  email: {
    optional: true,
    isEmail: {
      errorMessage: "Email is in wrong format"
    }
  },
  first_name: {
    optional: true,
    isString: {
      errorMessage: "First name should be text"
    }
  },
  last_name: {
    optional: true,
    isString: {
      errorMessage: "Last name should be text"
    }
  },
  display_name: {
    optional: true,
    isLength: {
      errorMessage: "Display name must be at least 5 characters long",
      options: {
        min: 5
      }
    }
  },
  phone_number: {
    optional: true,
    isMobilePhone: {
      errorMessage: "Phone number is in wrong format"
    }
  },
  date_of_birth: {
    optional: true,
    isDate: {
      errorMessage: "Date is invalid"
    }
  },
  nationality: {
    optional: true,
    isString: {
      errorMessage: "Nationality should be text"
    }
  },
  gender: {
    optional: true,
    isIn: {
      options: [Gender.MALE, Gender.FEMALE],
      errorMessage: "Gender must be male or female"
    }
  }
});
