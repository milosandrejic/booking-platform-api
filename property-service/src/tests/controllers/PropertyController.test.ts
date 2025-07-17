import { Request, Response } from "express";
import { propertyRepository } from "src/repositories";
import PropertyController from "src/controllers/PropertyController";
import { describe, expect, jest, beforeEach, it } from "@jest/globals";
import Property from "src/model/Property";
import PropertyType from "src/types/propertyType";

jest.mock("src/repositories", () => ({
  propertyRepository: {
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

describe("PropertyController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let responseObject: Record<string, unknown>;

  beforeEach(() => {
    mockRequest = {
      body: {
        ownerId: "owner-123",
        title: "Beautiful Apartment",
        description: "A spacious apartment in the city center",
        price: 120.50,
        location: {
          type: "Point",
          coordinates: [-74.0060, 40.7128]
        },
        addressLine: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isActive: true,
        type: PropertyType.APARTMENT,
        facilities: ["WiFi", "Kitchen", "Air Conditioning"]
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
    it("should create a property successfully", async () => {
      const mockProperty = {
        id: "property-123",
        ownerId: "owner-123",
        title: "Beautiful Apartment",
        description: "A spacious apartment in the city center",
        price: 120.50,
        location: {
          type: "Point",
          coordinates: [-74.0060, 40.7128]
        },
        addressLine: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isActive: true,
        type: PropertyType.APARTMENT,
        facilities: ["WiFi", "Kitchen", "Air Conditioning"],
        createdAt: new Date(),
        updatedAt: new Date()
      } as Property;

      jest.spyOn(propertyRepository, "save").mockResolvedValue(mockProperty);

      await PropertyController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ownerId: "owner-123",
        title: "Beautiful Apartment",
        type: PropertyType.APARTMENT,
        price: 120.50
      }));
      expect(mockResponse.send).toHaveBeenCalledWith(mockProperty);
    });

    it("should return 400 if property creation fails", async () => {
      jest.spyOn(propertyRepository, "save").mockRejectedValue(new Error("Database error"));

      await PropertyController.create(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
  });

  describe("update", () => {
    it("should update a property successfully", async () => {
      const existingProperty = {
        id: "property-123",
        title: "Old Title",
        ownerId: "owner-123"
      } as Property;

      const updatedProperty = {
        ...existingProperty,
        title: "New Title"
      } as Property;

      mockRequest.params = { id: "property-123" };
      mockRequest.body = { title: "New Title" };

      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(existingProperty);
      jest.spyOn(propertyRepository, "save").mockResolvedValue(updatedProperty);

      await PropertyController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyRepository.findOneBy).toHaveBeenCalledWith({ id: "property-123" });
      expect(propertyRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: "property-123",
        title: "New Title"
      }));
      expect(mockResponse.send).toHaveBeenCalledWith(updatedProperty);
    });

    it("should return 400 if property not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(null);

      await PropertyController.update(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Property not found" });
    });
  });

  describe("get", () => {
    it("should return a property by id", async () => {
      const mockProperty = {
        id: "property-123",
        title: "Beautiful Apartment",
        ownerId: "owner-123"
      } as Property;

      mockRequest.params = { id: "property-123" };
      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(mockProperty);

      await PropertyController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyRepository.findOneBy).toHaveBeenCalledWith({ id: "property-123" });
      expect(mockResponse.send).toHaveBeenCalledWith(mockProperty);
    });

    it("should return 400 if property not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(null);

      await PropertyController.get(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Property not found" });
    });
  });

  describe("delete", () => {
    it("should delete a property successfully", async () => {
      const mockProperty = {
        id: "property-123",
        title: "Property to Delete",
        ownerId: "owner-123"
      } as Property;

      mockRequest.params = { id: "property-123" };
      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(mockProperty);
      jest.spyOn(propertyRepository, "remove").mockResolvedValue(mockProperty);

      await PropertyController.delete(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyRepository.findOneBy).toHaveBeenCalledWith({ id: "property-123" });
      expect(propertyRepository.remove).toHaveBeenCalledWith(mockProperty);
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 400 if property not found", async () => {
      mockRequest.params = { id: "non-existent" };
      jest.spyOn(propertyRepository, "findOneBy").mockResolvedValue(null);

      await PropertyController.delete(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ error: "Property not found" });
    });
  });

  describe("listForUser", () => {
    it("should return all properties for a user", async () => {
      const mockProperties = [
        { id: "property-1",
          title: "Property 1",
          ownerId: "owner-123" },
        { id: "property-2",
          title: "Property 2",
          ownerId: "owner-123" }
      ] as Property[];

      mockRequest.params = { ownerId: "owner-123" };
      jest.spyOn(propertyRepository, "find").mockResolvedValue(mockProperties);

      await PropertyController.listForUser(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(propertyRepository.find).toHaveBeenCalledWith({ ownerId: "owner-123" });
      expect(mockResponse.send).toHaveBeenCalledWith(mockProperties);
    });

    it("should return empty array if no properties found", async () => {
      mockRequest.params = { ownerId: "owner-123" };
      jest.spyOn(propertyRepository, "find").mockResolvedValue([]);

      await PropertyController.listForUser(
        mockRequest as Request,
        mockResponse as unknown as Response
      );

      expect(mockResponse.send).toHaveBeenCalledWith([]);
    });
  });
});
