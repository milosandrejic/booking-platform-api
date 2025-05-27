import axios from "axios";

import { issueServiceToken } from "../utils/jwt";

const token = issueServiceToken("property-service");
const serviceName = "property-service";

export const userServiceApi = axios.create({
  baseURL: process.env.USER_SERVICE_API_URL,
  headers: {
    "x-authorization": `Bearer ${token}`,
    "x-service-name": serviceName
  }
});

export default userServiceApi;
