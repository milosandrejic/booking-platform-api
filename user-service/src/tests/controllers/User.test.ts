import { Request, Response } from "express";
import { Role, Gender } from "src/model";
import { userRepository, authRepository } from "src/repositories";
import userController from "src/controllers/User";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import { User, Auth } from "src/model";
import { PasswordUtils } from "src/utils/passwordUtils";

jest.mock("src/repositories", () => ({
  userRepository: {
    findOneBy: jest.fn(),
    save: jest.fn(),
    findOneByAuthId: jest.fn(),
    findOneWithAuth: jest.fn()
  },
  authRepository: {
    save: jest.fn()
  }
}));

jest.mock("src/utils/passwordUtils", () => ({
  PasswordUtils: {
    hash: jest.fn()
  }
}));

type MockResponse = {
  status: jest.Mock;
  send: jest.Mock;
  sendStatus: jest.Mock;
};

describe("UserController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let responseObject: Record<string, unknown>;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        dateOfBirth: "1990-01-01",
        nationality: "US",
        gender: Gender.MALE
      },
      params: {
        id: "123"
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

  describe("create", () => {
    it("should create a new user with display name", async () => {
      const mockAuth = {
        id: "1",
        email: "test@example.com",
        emailVerified: false,
        password: "hashed_password",
        role: Role.USER,
        createdAt: new Date(),
        user: undefined
      } as Partial<Auth>;

      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
        phoneNumber: "+1234567890",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      jest.spyOn(userRepository, "save").mockResolvedValue(mockUser as User);

      await userController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.save).toHaveBeenCalled();
      expect(responseObject).toEqual(mockUser);
    });

    it("should create a new user with custom display name", async () => {
      mockRequest.body = {
        ...mockRequest.body,
        displayName: "Custom Name"
      };

      const mockAuth = {
        id: "1",
        email: "test@example.com",
        emailVerified: false,
        password: "hashed_password",
        role: Role.USER,
        createdAt: new Date(),
        user: undefined
      } as Partial<Auth>;

      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        displayName: "Custom Name",
        phoneNumber: "+1234567890",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      jest.spyOn(userRepository, "save").mockResolvedValue(mockUser as User);

      await userController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.save).toHaveBeenCalled();
      expect(responseObject).toEqual(mockUser);
    });

    it("should return 400 on error", async () => {
      jest.spyOn(userRepository, "save").mockRejectedValue(new Error("Database error"));

      await userController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const mockAuth = {
        id: "1",
        email: "test@example.com",
        emailVerified: false,
        password: "hashed_password",
        role: Role.USER,
        createdAt: new Date(),
        user: undefined
      } as Partial<Auth>;

      const existingUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
        phoneNumber: "+1234567890",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      const updatedData = {
        firstName: "Jane",
        lastName: "Smith"
      };

      mockRequest.body = updatedData;
      mockRequest.auth = {
        id: "auth-123",
        email: "test@example.com",
        role: Role.USER,
        emailVerified: true,
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Auth;

      jest.spyOn(userRepository, "findOneByAuthId").mockResolvedValue(existingUser as User);
      jest.spyOn(userRepository, "save").mockResolvedValue({
        ...existingUser,
        ...updatedData
      } as User);

      await userController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.save).toHaveBeenCalled();
      expect(responseObject).toEqual({
        ...existingUser,
        ...updatedData
      });
    });

    it("should return 404 if user not found", async () => {
      mockRequest.auth = {
        id: "auth-123",
        email: "test@example.com",
        role: Role.USER,
        emailVerified: true,
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Auth;

      jest.spyOn(userRepository, "findOneByAuthId").mockResolvedValue(null);

      await userController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        error: "User not found"
      });
    });
  });

  describe("get", () => {
    it("should get an existing user", async () => {
      const mockAuth = {
        id: "1",
        email: "test@example.com",
        emailVerified: false,
        password: "hashed_password",
        role: Role.USER,
        createdAt: new Date(),
        user: undefined
      } as Partial<Auth>;

      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
        phoneNumber: "+1234567890",
        dateOfBirth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      jest.spyOn(userRepository, "findOneBy").mockResolvedValue(mockUser as User);

      await userController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "123" });
      expect(responseObject).toEqual(mockUser);
    });

    it("should return 400 if user not found", async () => {
      jest.spyOn(userRepository, "findOneBy").mockResolvedValue(null);

      await userController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: "User not found"
      });
    });
  });

  describe("me", () => {
    it("should return current user data", async () => {
      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        auth: {
          id: "auth-123",
          email: "test@example.com",
          role: Role.USER
        }
      };

      mockRequest.auth = {
        id: "auth-123",
        email: "test@example.com",
        role: Role.USER,
        emailVerified: true,
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Auth;

      jest.spyOn(userRepository, "findOneByAuthId").mockResolvedValue(mockUser as any);

      await userController.me(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.findOneByAuthId).toHaveBeenCalledWith("auth-123");
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      mockRequest.auth = {
        id: "auth-123",
        email: "test@example.com",
        role: Role.USER,
        emailVerified: true,
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Auth;

      jest.spyOn(userRepository, "findOneByAuthId").mockResolvedValue(null);

      await userController.me(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        error: "User not found"
      });
    });

    it("should return 500 if repository throws error", async () => {
      mockRequest.auth = {
        id: "auth-123",
        email: "test@example.com",
        role: Role.USER,
        emailVerified: true,
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Auth;

      jest.spyOn(userRepository, "findOneByAuthId").mockRejectedValue(new Error("Database error"));

      await userController.me(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        error: "Internal server error"
      });
    });
  });

  describe("resetPassword", () => {
    beforeEach(() => {
      mockRequest.body = {
        newPassword: "newPassword123"
      };
    });

    it("should reset password successfully", async () => {
      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        auth: {
          id: "auth-123",
          email: "test@example.com",
          role: Role.USER,
          password: "oldHashedPassword"
        }
      };

      jest.spyOn(userRepository, "findOneWithAuth").mockResolvedValue(mockUser as any);
      jest.spyOn(PasswordUtils, "hash").mockResolvedValue("newHashedPassword");
      jest.spyOn(authRepository, "save").mockResolvedValue(mockUser.auth as any);

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.findOneWithAuth).toHaveBeenCalledWith("123");
      expect(PasswordUtils.hash).toHaveBeenCalledWith("newPassword123");
      expect(authRepository.save).toHaveBeenCalledWith({
        ...mockUser.auth,
        password: "newHashedPassword"
      });
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Password reset successful"
      });
    });

    it("should return 404 if user not found", async () => {
      jest.spyOn(userRepository, "findOneWithAuth").mockResolvedValue(null);

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        error: "User not found"
      });
    });

    it("should return 400 if newPassword is missing", async () => {
      mockRequest.body = {};

      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        auth: {
          id: "auth-123",
          email: "test@example.com",
          role: Role.USER
        }
      };

      jest.spyOn(userRepository, "findOneWithAuth").mockResolvedValue(mockUser as any);

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        error: "New password is required"
      });
    });

    it("should return 500 if repository throws error", async () => {
      jest.spyOn(userRepository, "findOneWithAuth").mockRejectedValue(new Error("Database error"));

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        error: "Internal server error"
      });
    });
  });
});
