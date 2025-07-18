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
  password: {
    notEmpty: {
      errorMessage: "Password is required"
    },
    isLength: {
      errorMessage: "Password must be at least 8 characters long",
      options: {
        min: 8
      }
    },
    isString: {
      errorMessage: "Password should be text"
    }
  },
  firstName: {
    notEmpty: {
      errorMessage: "First name is required"
    },
    isString: {
      errorMessage: "First name should be text"
    }
  },
  lastName: {
    notEmpty: {
      errorMessage: "Last name is required"
    },
    isString: {
      errorMessage: "Last name should be text"
    }
  },
  displayName: {
    optional: true,
    isLength: {
      errorMessage: "Display name must be at least 5 characters long",
      options: {
        min: 5
      }
    }
  },
  phoneNumber: {
    notEmpty: {
      errorMessage: "Mobile phone is required"
    },
    isMobilePhone: {
      errorMessage: "Phone number is in wrong format"
    }
  },
  dateOfBirth: {
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
  firstName: {
    optional: true,
    isString: {
      errorMessage: "First name should be text"
    }
  },
  lastName: {
    optional: true,
    isString: {
      errorMessage: "Last name should be text"
    }
  },
  displayName: {
    optional: true,
    isLength: {
      errorMessage: "Display name must be at least 5 characters long",
      options: {
        min: 5
      }
    }
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: {
      errorMessage: "Phone number is in wrong format"
    }
  },
  dateOfBirth: {
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

export const loginSchema: ValidationChain[] = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required"
    },
    isEmail: {
      errorMessage: "Email is in wrong format"
    }
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required"
    },
    isString: {
      errorMessage: "Password should be text"
    }
  }
});

export const resetPasswordSchema: ValidationChain[] = checkSchema({
  newPassword: {
    notEmpty: {
      errorMessage: "New password is required"
    },
    isLength: {
      errorMessage: "Password must be at least 8 characters long",
      options: {
        min: 8
      }
    },
    isString: {
      errorMessage: "Password should be text"
    }
  }
});
