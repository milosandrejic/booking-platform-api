import axios from "axios";

// Base API configuration
const createAPIClient = (baseURL: string): any => {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export default createAPIClient;
