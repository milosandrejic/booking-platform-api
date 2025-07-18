import "express";

declare global {
  namespace Express {
    interface Request {
      auth: {
        id: string;
        email: string;
        role: string;
      };
      internalService?: {
        serviceId: string;
        serviceName: string;
      };
    }
  }
}
