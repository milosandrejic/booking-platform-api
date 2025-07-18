import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Auth } from "src/model";

const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || "internal-service-secret-key";

const ALLOWED_SERVICES = [
  {
    serviceId: "booking-service",
    serviceName: "Booking Service"
  },
  {
    serviceId: "property-service",
    serviceName: "Property Service"
  }
];

interface InternalServicePayload {
  serviceId: string;
  serviceName: string;
  iat: number;
  exp: number;
}

const validateServiceIdentity = (serviceId: string, serviceName: string): boolean => {
  const allowedService = ALLOWED_SERVICES.find(service => service.serviceId === serviceId);

  if (!allowedService) {
    return false;
  }

  return allowedService.serviceName === serviceName;
};

export const withInternalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const internalToken = req.headers["x-internal-service-token"] as string;

  if (internalToken) {
    try {
      const decoded = jwt.verify(internalToken, INTERNAL_SERVICE_SECRET) as InternalServicePayload;

      if (!validateServiceIdentity(decoded.serviceId, decoded.serviceName)) {
        res.status(403).json({
          error: "Invalid service identity or service not whitelisted",
          serviceId: decoded.serviceId,
          serviceName: decoded.serviceName
        });
        return;
      }

      req.internalService = {
        serviceId: decoded.serviceId,
        serviceName: decoded.serviceName
      };

      next();
      return;
    } catch {
      res.status(401).json({ error: "Invalid internal service token" });
      return;
    }
  }

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header is required" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.auth = decoded as Auth;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const generateInternalServiceToken = (serviceId: string, serviceName: string): string => {
  if (!validateServiceIdentity(serviceId, serviceName)) {
    throw new Error(`Invalid service identity: ${serviceId} -> ${serviceName}`);
  }

  return jwt.sign(
    {
      serviceId,
      serviceName
    },
    INTERNAL_SERVICE_SECRET,
    {
      expiresIn: "15m"
    }
  );
};
