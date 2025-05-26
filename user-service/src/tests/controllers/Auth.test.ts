import { Request, Response } from "express";
import { Role } from "src/model";
import { authRepository } from "src/repositories";
import authController from "src/controllers/Auth";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import { Auth } from "src/model/Auth";
import * as jwt from "jsonwebtoken";
import { PasswordUtils } from "src/utils/passwordUtils";

jest.mock("src/repositories", () => ({
  authRepository: {
    findOneBy: jest.fn(),
    save: jest.fn()
  }
}));

jest.mock("jsonwebtoken");
jest.mock("src/utils/passwordUtils");

type MockResponse = {
  status: jest.Mock;
  send: jest.Mock;
  sendStatus: jest.Mock;
};

describe("AuthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let responseObject: Record<string, unknown>;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123"
      }
    };

    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockImplementation((result: unknown) => {
        responseObject = result as Record<string, unknown>;
        return mockResponse;
      }),
      sendStatus: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return 400 if user does not exist", async () => {
      jest.spyOn(authRepository, "findOneBy").mockResolvedValue(null);

      await authController.login(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: "User with email test@example.com does no exists"
      });
    });

    it("should return 400 if password is incorrect", async () => {
      const mockAuth = {
        id: "1",
        email: "test@example.com",
        email_verified: false,
        password: "hashed_password",
        role: Role.USER,
        access_token: "",
        created_at: new Date(),
        user: undefined
      } as Partial<Auth>;

      jest.spyOn(authRepository, "findOneBy").mockResolvedValue(mockAuth as Auth);
      jest.spyOn(PasswordUtils, "compare").mockResolvedValue(false);

      await authController.login(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: "Wrong email or password"
      });
    });

    it("should return token on successful login", async () => {
      const mockAuth = {
        id: "1",
        email: "test@example.com",
        email_verified: false,
        password: "hashed_password",
        role: Role.USER,
        access_token: "",
        created_at: new Date(),
        user: undefined
      } as Partial<Auth>;

      const mockToken = "mock.jwt.token";

      jest.spyOn(authRepository, "findOneBy").mockResolvedValue(mockAuth as Auth);
      jest.spyOn(PasswordUtils, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockImplementation(() => mockToken);

      await authController.login(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(responseObject).toEqual({
        access_token: mockToken
      });
    });
  });
});
