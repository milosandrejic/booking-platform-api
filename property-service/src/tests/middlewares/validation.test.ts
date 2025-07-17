import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { withValidation } from "src/middlewares/validation";
import { ValidationFactory } from "src/validations/validationFatory";

jest.mock("express-validator");
jest.mock("src/validations/validationFatory");

describe("Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      route: { path: "/api/properties" },
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      send: jest.fn() as unknown as Response["send"]
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe("withValidation", () => {
    it("should proceed to next middleware if no validators found", async () => {
      jest.spyOn(ValidationFactory, "getValidationSchema").mockReturnValue(null as any);

      await withValidation(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it("should proceed to next middleware if validation passes", async () => {
      const mockValidator = {
        run: jest.fn().mockImplementation(() => Promise.resolve())
      };

      jest.spyOn(ValidationFactory, "getValidationSchema").mockReturnValue([mockValidator as any]);

      const mockResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        mapped: jest.fn().mockReturnValue({})
      };

      const mockValidationResultHandler = jest.fn().mockReturnValue(mockResult);

      (validationResult as unknown as { withDefaults: jest.Mock }).withDefaults = jest.fn().mockReturnValue(mockValidationResultHandler);

      await withValidation(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockValidator.run).toHaveBeenCalledWith(mockRequest);
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 400 if validation fails", async () => {
      const mockValidator = {
        run: jest.fn().mockImplementation(() => Promise.resolve())
      };

      jest.spyOn(ValidationFactory, "getValidationSchema").mockReturnValue([mockValidator as any]);

      const mockErrors = {
        title: "Title is required",
        price: "Price must be a number"
      };

      const mockResult = {
        isEmpty: jest.fn().mockReturnValue(false),
        mapped: jest.fn().mockReturnValue(mockErrors)
      };

      const mockValidationResultHandler = jest.fn().mockReturnValue(mockResult);

      (validationResult as unknown as { withDefaults: jest.Mock }).withDefaults = jest.fn().mockReturnValue(mockValidationResultHandler);

      await withValidation(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockValidator.run).toHaveBeenCalledWith(mockRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Validation failed",
        errors: mockErrors
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should handle multiple validators", async () => {
      const mockValidator1 = {
        run: jest.fn().mockImplementation(() => Promise.resolve())
      };
      const mockValidator2 = {
        run: jest.fn().mockImplementation(() => Promise.resolve())
      };

      jest.spyOn(ValidationFactory, "getValidationSchema").mockReturnValue([mockValidator1, mockValidator2] as any);

      const mockResult = {
        isEmpty: jest.fn().mockReturnValue(true),
        mapped: jest.fn().mockReturnValue({})
      };

      const mockValidationResultHandler = jest.fn().mockReturnValue(mockResult);

      (validationResult as unknown as { withDefaults: jest.Mock }).withDefaults = jest.fn().mockReturnValue(mockValidationResultHandler);

      await withValidation(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockValidator1.run).toHaveBeenCalledWith(mockRequest);
      expect(mockValidator2.run).toHaveBeenCalledWith(mockRequest);
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
