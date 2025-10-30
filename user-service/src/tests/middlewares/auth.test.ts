import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { withAuth } from "src/middlewares/auth";
import { withInternalAuth } from "src/middlewares/internalAuth";
import { Auth } from "src/model";
import { authRepository } from "src/repositories";

jest.mock("jsonwebtoken");
jest.mock("src/repositories");

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      send: jest.fn() as unknown as Response["send"],
      json: jest.fn() as unknown as Response["json"]
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe("withAuth", () => {
    it("should return 401 if no authorization header", async () => {
      mockRequest.headers = {};

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.headers = { authorization: "Bearer invalid-token" };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if auth not found", async () => {
      mockRequest.headers = { authorization: "Bearer valid-token" };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: "123",
        email: "test@test.com",
        role: "USER"
      });

      (authRepository.findOneBy as jest.Mock<any>).mockResolvedValue(null);

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should set auth and call next if token is valid", async () => {
      const mockAuth = {
        id: "123",
        email: "test@test.com",
        role: "USER"
      } as Auth;

      mockRequest.headers = { authorization: "Bearer valid-token" };

      (jwt.verify as jest.Mock).mockReturnValue({
        id: "123",
        email: "test@test.com",
        role: "USER"
      });

      (authRepository.findOneBy as jest.Mock<any>).mockResolvedValue(mockAuth);

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.auth).toBe(mockAuth);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it("should return 401 if authorization header does not start with 'Bearer '", async () => {
      mockRequest.headers = { authorization: "Token sometoken" };

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is empty after 'Bearer '", async () => {
      mockRequest.headers = { authorization: "Bearer " };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if decoded token is falsy", async () => {
      mockRequest.headers = { authorization: "Bearer valid-token" };
      (jwt.verify as jest.Mock).mockReturnValue(undefined);

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if decoded token is missing id", async () => {
      mockRequest.headers = { authorization: "Bearer valid-token" };
      (jwt.verify as jest.Mock).mockReturnValue({
        email: "test@test.com",
        role: "USER"
      });

      (authRepository.findOneBy as jest.Mock<any>).mockResolvedValue(null);

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe("withInternalAuth", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 401 if no x-internal-service-token header", async () => {
      mockRequest.headers = {};

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal service token required" });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.headers = {
        "x-internal-service-token": "invalid-token"
      };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid internal service token" });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 403 if service is not whitelisted", async () => {
      mockRequest.headers = {
        "x-internal-service-token": "valid-token"
      };
      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "unknown-service",
        serviceName: "Unknown Service"
      });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid service identity or service not whitelisted",
        serviceId: "unknown-service",
        serviceName: "Unknown Service"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 403 if serviceId and serviceName don't match", async () => {
      mockRequest.headers = {
        "x-internal-service-token": "valid-token"
      };
      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Wrong Service Name"
      });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid service identity or service not whitelisted",
        serviceId: "booking-service",
        serviceName: "Wrong Service Name"
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next if token and service identity are valid", async () => {
      mockRequest.headers = {
        "x-internal-service-token": "valid-token"
      };
      (jwt.verify as jest.Mock).mockReturnValue({
        serviceId: "booking-service",
        serviceName: "Booking Service"
      });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.internalService).toEqual({
        serviceId: "booking-service",
        serviceName: "Booking Service"
      });
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
