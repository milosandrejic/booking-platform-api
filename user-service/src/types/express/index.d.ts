import "express";
import { Auth } from "src/model";

declare global {
  namespace Express {
    interface Request {
      auth: Auth;
      internalService?: {
        serviceId: string;
        serviceName: string;
      };
    }
  }
}
