import { Request, Response } from "express";
import { propertyReviewRepository } from "src/repositories";
import PropertyReviewController from "src/controllers/PropertyReviewController";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import PropertyReview from "src/model/PropertyReview";

jest.mock("src/repositories", () => ({
  propertyReviewRepository: {
    findOneBy: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
  }
}));

type MockResponse = {
  status: jest.Mock;
  send: jest.Mock;
  sendStatus: jest.Mock;
};

describe("PropertyReviewController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let responseObject: Record<string, unknown>;

  beforeEach(() => {
    mockRequest = {
      body: {
        propertyId: "property-123",
        userId: "user-123",
        rating: 5,
        comment: "Excellent property! Very clean and comfortable."
      },
      params: {}
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
    it("should create a property review successfully", async () => {
      const mockReview = {
        id: "review-123",
        propertyId: "property-123",
        userId: "user-123",
        rating: 5,
        comment: "Excellent property! Very clean and comfortable.",
        createdAt: new Date(),
        updatedAt: new Date()
      } as PropertyReview;

      jest.spyOn(propertyReviewRepository, "save").mockResolvedValue(mockReview);

      await PropertyReviewController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyReviewRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        propertyId: "property-123",
        userId: "user-123",
        rating: 5,
        comment: "Excellent property! Very clean and comfortable."
      }));
      expect(mockResponse.send).toHaveBeenCalledWith(mockReview);
    });

    it("should return 400 if review creation fails", async () => {
      jest.spyOn(propertyReviewRepository, "save").mockRejectedValue(new Error("Database error"));

      await PropertyReviewController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("update", () => {
    it("should update a property review successfully", async () => {
      const existingReview = {
        id: "review-123",
        rating: 4,
        comment: "Good property"
      } as PropertyReview;

      const updatedReview = {
        ...existingReview,
        rating: 5,
        comment: "Great property, updated review"
      } as PropertyReview;

      mockRequest.params = { id: "review-123" };
      mockRequest.body = {
        rating: 5,
        comment: "Great property, updated review"
      };

      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(existingReview);
      jest.spyOn(propertyReviewRepository, "save").mockResolvedValue(updatedReview);

      await PropertyReviewController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyReviewRepository.findOneBy).toHaveBeenCalledWith({ id: "review-123" });
      expect(propertyReviewRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: "review-123",
        rating: 5,
        comment: "Great property, updated review"
      }));
      expect(mockResponse.send).toHaveBeenCalledWith(updatedReview);
    });

    it("should return 400 if review not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(null);

      await PropertyReviewController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Review not found" });
    });
  });

  describe("get", () => {
    it("should return a review by id", async () => {
      const mockReview = {
        id: "review-123",
        propertyId: "property-123",
        userId: "user-123",
        rating: 5,
        comment: "Excellent property!"
      } as PropertyReview;

      mockRequest.params = { id: "review-123" };
      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(mockReview);

      await PropertyReviewController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyReviewRepository.findOneBy).toHaveBeenCalledWith({ id: "review-123" });
      expect(mockResponse.send).toHaveBeenCalledWith(mockReview);
    });

    it("should return 400 if review not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(null);

      await PropertyReviewController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Review not found" });
    });
  });

  describe("delete", () => {
    it("should delete a review successfully", async () => {
      const mockReview = {
        id: "review-123",
        propertyId: "property-123",
        userId: "user-123",
        rating: 5,
        comment: "Review to delete"
      } as PropertyReview;

      mockRequest.params = { id: "review-123" };
      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(mockReview);
      jest.spyOn(propertyReviewRepository, "remove").mockResolvedValue(mockReview);

      await PropertyReviewController.delete(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyReviewRepository.findOneBy).toHaveBeenCalledWith({ id: "review-123" });
      expect(propertyReviewRepository.remove).toHaveBeenCalledWith(mockReview);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 400 if review not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyReviewRepository, "findOneBy").mockResolvedValue(null);

      await PropertyReviewController.delete(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Review not found" });
    });
  });

  describe("listForProperty", () => {
    it("should return all reviews for a property", async () => {
      const mockReviews = [
        {
          id: "review-1",
          propertyId: "property-123",
          userId: "user-1",
          rating: 5,
          comment: "Great property!"
        },
        {
          id: "review-2",
          propertyId: "property-123",
          userId: "user-2",
          rating: 4,
          comment: "Good property"
        }
      ] as PropertyReview[];

      mockRequest.params = { propertyId: "property-123" };
      jest.spyOn(propertyReviewRepository, "find").mockResolvedValue(mockReviews);

      await PropertyReviewController.listForProperty(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyReviewRepository.find).toHaveBeenCalledWith({ propertyId: "property-123" });
      expect(mockResponse.send).toHaveBeenCalledWith(mockReviews);
    });

    it("should return empty array if no reviews found", async () => {
      mockRequest.params = { propertyId: "property-123" };
      jest.spyOn(propertyReviewRepository, "find").mockResolvedValue([]);

      await PropertyReviewController.listForProperty(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.send).toHaveBeenCalledWith([]);
    });
  });
});
