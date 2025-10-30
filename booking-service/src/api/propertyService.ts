import createAPIClient from "./base";
import { getCachedInternalServiceToken } from "src/utils/internalAuth";

const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || "http://property-service:3001";

interface PriceCalculationRequest {
  checkIn: string;
  checkOut: string;
}

interface PriceCalculationResponse {
  totalPrice: number;
  breakdown: {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    currency: string;
    nights: number;
  };
}

class PropertyServiceAPI {
  private client: any;

  constructor() {
    this.client = createAPIClient(PROPERTY_SERVICE_URL);
  }

  async calculatePrice(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<PriceCalculationResponse> {
    try {
      const response = await this.client.post(
        `/api/internal/property/${propertyId}/pricing/calculate`,
        {
          checkIn,
          checkOut
        } as PriceCalculationRequest,
        {
          headers: {
            "x-internal-service-token": getCachedInternalServiceToken()
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Property service error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error("Property service is not responding");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  async getProperty(propertyId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/api/internal/property/${propertyId}`,
        {
          headers: {
            "x-internal-service-token": getCachedInternalServiceToken()
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Property service error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error("Property service is not responding");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}

export const propertyServiceAPI = new PropertyServiceAPI();
export default PropertyServiceAPI;
