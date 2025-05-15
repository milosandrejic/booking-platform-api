import { Auth } from "src/model";

declare global {
  namespace Express {
    interface Request {
      auth: Auth;
    }
  }
}
