import { Request, Response, NextFunction } from "express";
import { verifyToken } from "src/utils/jwt";

export const withAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token required" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
