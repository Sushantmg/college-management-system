import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestWithUser, AuthPayload } from "../types/global-types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

// -------------------------
// JWT Authentication Middleware
// -------------------------
export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Bearer token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// -------------------------
// Role-based Authorization Middleware
// -------------------------
export const permit = (...allowedRoles: AuthPayload["role"][]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user info" });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
};

// -------------------------
// Shortcut Middlewares
// -------------------------
export const superUserOnly = (req: RequestWithUser, res: Response, next: NextFunction) => {
  return permit("SUPERUSER")(req, res, next);
};

export const staffOnly = (req: RequestWithUser, res: Response, next: NextFunction) => {
  return permit("STAFF", "SUPERUSER")(req, res, next);
};
