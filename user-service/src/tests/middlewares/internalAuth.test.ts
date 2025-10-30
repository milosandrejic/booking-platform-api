import { Request, Response, NextFunction } from "express";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { withInternalAuth } from "src/middlewares/internalAuth";

jest.mock("jsonwebtoken");

describe("Internal Service Authentication Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  // Store original env vars
  const originalEnv = process.env;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      json: jest.fn() as unknown as Response["json"],
      send: jest.fn() as unknown as Response["send"]
    };

    nextFunction = jest.fn();

    // Set environment variables for testing
    process.env = {
      ...originalEnv,
      INTERNAL_SERVICE_SECRET: "test-internal-secret-key",
      ALLOWED_SERVICES: "booking-service,property-service"
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe("Missing Token", () => {
    it("should return 401 when no internal service token is provided", () => {
      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal service token required"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 when token header is empty", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "";

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal service token required"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("Invalid Token", () => {
    it("should return 401 for malformed token", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "invalid-token-format";

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid internal service token"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 for token with invalid signature", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "fake.jwt.token";

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid signature");
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid internal service token"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 for expired token", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "expired.jwt.token";

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt expired");
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid internal service token"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("Service Authorization", () => {
    it("should return 403 for non-whitelisted service", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "unauthorized-service",
        serviceName: "Unauthorized Service",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid service identity or service not whitelisted",
        serviceId: "unauthorized-service",
        serviceName: "Unauthorized Service"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 403 for token with wrong serviceName for booking-service", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Wrong Name",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid service identity or service not whitelisted",
        serviceId: "booking-service",
        serviceName: "Wrong Name"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("Valid Token", () => {
    it("should allow request from booking-service", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Booking Service",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should allow request from property-service", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "property-service",
        serviceName: "Property Service",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should attach service info to request object", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Booking Service",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect((mockRequest as any).internalService).toEqual({
        serviceId: "booking-service",
        serviceName: "Booking Service"
      });
    });
  });

  describe("Environment Variables", () => {
    it("should work with the configured allowed services", () => {
      (mockRequest.headers as Record<string, string>)["x-internal-service-token"] = "valid.jwt.token";

      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Booking Service",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      });

      withInternalAuth(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // Should work with configured services
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
