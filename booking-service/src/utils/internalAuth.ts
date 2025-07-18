import jwt from "jsonwebtoken";

const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || "internal-service-secret-key";
const SERVICE_ID = process.env.SERVICE_ID || "booking-service";
const SERVICE_NAME = process.env.SERVICE_NAME || "Booking Service";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export const generateInternalServiceToken = (): string => {
  return jwt.sign(
    {
      serviceId: SERVICE_ID,
      serviceName: SERVICE_NAME
    },
    INTERNAL_SERVICE_SECRET,
    {
      expiresIn: "15m"
    }
  );
};

export const getCachedInternalServiceToken = (): string => {
  const now = Date.now();
  const bufferTime = 2 * 60 * 1000;
  
  if (!cachedToken || now >= (tokenExpiry - bufferTime)) {
    cachedToken = generateInternalServiceToken();
    
    const decoded = jwt.decode(cachedToken) as any;
    tokenExpiry = decoded.exp * 1000;
  }
  
  return cachedToken;
};

export const getInternalServiceHeaders = () => {
  return {
    "x-internal-service-token": getCachedInternalServiceToken()
  };
};
