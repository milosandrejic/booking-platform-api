import createAPIClient from "./base";
import { getCachedInternalServiceToken } from "src/utils/internalAuth";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3000";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}

class UserServiceAPI {
  private client: any;

  constructor() {
    this.client = createAPIClient(USER_SERVICE_URL);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.client.get(
        `/api/internal/user/${userId}`,
        {
          headers: {
            "x-internal-service-token": getCachedInternalServiceToken()
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`User service error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error("User service is not responding");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  async validateUser(authToken: string): Promise<any> {
    try {
      const response = await this.client.get(
        "/api/v1/me",
        {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`User service error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error("User service is not responding");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}

export const userServiceAPI = new UserServiceAPI();
export default UserServiceAPI;
