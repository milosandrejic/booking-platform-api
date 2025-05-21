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
      route: { path: "/test" }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      send: jest.fn() as unknown as Response["send"]
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
    (validationResult as any).withDefaults = jest.fn(() => jest.fn(() => ({
      isEmpty: () => true,
      mapped: () => ({})
    })));
  });

  it("should call next if no validators exist for the route", async () => {
    (ValidationFactory.getValidationSchema as jest.Mock).mockReturnValue(null);

    await withValidation(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it("should call next if validation passes", async () => {
    const mockValidators = [
      {
        run: jest.fn(() => Promise.resolve())
      }
    ];

    (ValidationFactory.getValidationSchema as jest.Mock).mockReturnValue(mockValidators);
    (validationResult as any).withDefaults = jest.fn(() => jest.fn(() => ({
      isEmpty: () => true,
      mapped: () => ({})
    })));

    await withValidation(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockValidators[0].run).toHaveBeenCalledWith(mockRequest);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.send).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails", async () => {
    const mockValidators = [
      {
        run: jest.fn(() => Promise.resolve())
      }
    ];

    const mockErrors = {
      field1: { msg: "Error 1" },
      field2: { msg: "Error 2" }
    };

    (ValidationFactory.getValidationSchema as jest.Mock).mockReturnValue(mockValidators);
    (validationResult as any).withDefaults = jest.fn(() => jest.fn(() => ({
      isEmpty: () => false,
      mapped: () => mockErrors
    })));

    await withValidation(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockValidators[0].run).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: mockErrors
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
