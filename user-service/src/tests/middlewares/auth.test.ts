import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { withAuth, resolveAuth } from "src/middlewares/auth";
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
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      mockRequest.headers = { authorization: "invalid-token" };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if auth not found", async () => {
      mockRequest.headers = { authorization: "valid-token" };

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

      mockRequest.headers = { authorization: "valid-token" };

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
  });

  describe("resolveAuth", () => {
    it("should return null if no token provided", async () => {
      const result = await resolveAuth("");
      expect(result).toBeNull();
    });

    it("should return null if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = await resolveAuth("invalid-token");
      expect(result).toBeNull();
    });

    it("should return auth if token is valid", async () => {
      const mockAuth = {
        id: "123",
        email: "test@test.com",
        role: "USER"
      } as Auth;

      (jwt.verify as jest.Mock).mockReturnValue({
        id: "123",
        email: "test@test.com",
        role: "USER"
      });

      (authRepository.findOneBy as jest.Mock<any>).mockResolvedValue(mockAuth);

      const result = await resolveAuth("valid-token");
      expect(result).toBe(mockAuth);
    });
  });
});
