import { describe, expect, it, jest } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { withAuth, withInternalAuth } from "src/middlewares/auth";
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

    it("should return 401 if no x-authorization header", async () => {
      mockRequest.headers = {
        "x-service-name": "serviceA"
      };

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if x-authorization header does not start with 'Bearer '", async () => {
      mockRequest.headers = {
        "x-authorization": "Token sometoken",
        "x-service-name": "serviceA"
      };

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if no x-service-name header", async () => {
      mockRequest.headers = {
        "x-authorization": "Bearer sometoken"
      };

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid (throws)", async () => {
      mockRequest.headers = {
        "x-authorization": "Bearer invalid-token",
        "x-service-name": "serviceA"
      };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should return 401 if decoded token service does not match x-service-name", async () => {
      mockRequest.headers = {
        "x-authorization": "Bearer valid-token",
        "x-service-name": "serviceA"
      };
      (jwt.verify as jest.Mock).mockReturnValue({ service: "otherService" });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Unauthorized." });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("should call next if token and service are valid", async () => {
      mockRequest.headers = {
        "x-authorization": "Bearer valid-token",
        "x-service-name": "serviceA"
      };
      (jwt.verify as jest.Mock).mockReturnValue({ service: "serviceA" });

      await withInternalAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });
  });
});
