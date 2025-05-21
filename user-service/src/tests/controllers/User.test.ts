import { Request, Response } from "express";
import { Role, Gender } from "src/model";
import { userRepository } from "src/repositories";
import userController from "src/controllers/User";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import { User } from "src/model/user";
import { Auth } from "src/model/auth";

// Mock dependencies
jest.mock("src/repositories", () => ({
  userRepository: {
    findOneBy: jest.fn(),
    save: jest.fn()
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
        first_name: "John",
        last_name: "Doe",
        phone_number: "+1234567890",
        date_of_birth: "1990-01-01",
        nationality: "US",
        gender: Gender.MALE
      },
      params: {
        id: "1"
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

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user with display name", async () => {
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

      const mockUser = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        phone_number: "+1234567890",
        date_of_birth: new Date("1990-01-01"),
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
        display_name: "Custom Name"
      };

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

      const mockUser = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        display_name: "Custom Name",
        phone_number: "+1234567890",
        date_of_birth: new Date("1990-01-01"),
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
        email_verified: false,
        password: "hashed_password",
        role: Role.USER,
        access_token: "",
        created_at: new Date(),
        user: undefined
      } as Partial<Auth>;

      const existingUser = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        phone_number: "+1234567890",
        date_of_birth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      const updatedData = {
        first_name: "Jane",
        last_name: "Smith"
      };

      mockRequest.body = updatedData;

      jest.spyOn(userRepository, "findOneBy").mockResolvedValue(existingUser as User);
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

    it("should return 400 if user not found", async () => {
      jest.spyOn(userRepository, "findOneBy").mockResolvedValue(null);

      await userController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
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
        email_verified: false,
        password: "hashed_password",
        role: Role.USER,
        access_token: "",
        created_at: new Date(),
        user: undefined
      } as Partial<Auth>;

      const mockUser = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        display_name: "John Doe",
        phone_number: "+1234567890",
        date_of_birth: new Date("1990-01-01"),
        nationality: "US",
        gender: Gender.MALE,
        auth: mockAuth
      } as Partial<User>;

      jest.spyOn(userRepository, "findOneBy").mockResolvedValue(mockUser as User);

      await userController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
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
});
