import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { withAuth } from "src/middlewares/auth";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      send: jest.fn() as unknown as Response["send"]
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe("withAuth", () => {
    it("should return 401 if no authorization header", async () => {
      mockRequest.headers = {};

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if authorization header does not start with Bearer", async () => {
      mockRequest.headers = {
        authorization: "Basic invalid-token"
      };

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.headers = { authorization: "Bearer invalid-token" };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should authenticate user with valid token", async () => {
      const mockPayload = {
        id: "user-123",
        email: "test@example.com",
        role: "USER"
      };

      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", process.env.JWT_SECRET);
      expect(mockRequest.auth).toEqual({
        id: "user-123",
        email: "test@example.com",
        role: "USER"
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should return 401 if JWT_SECRET is not defined", async () => {
      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("JWT_SECRET not defined");
      });

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized" });
      expect(nextFunction).not.toHaveBeenCalled();

      // Restore original secret
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
