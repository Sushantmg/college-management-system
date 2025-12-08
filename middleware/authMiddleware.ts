import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestWithUser, AuthPayload } from "../types/global-types";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

// --------------------------------------------------
// AUTHENTICATION MIDDLEWARE (Verify JWT)
// --------------------------------------------------
export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Bearer token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    // Attaching decoded user payload to req
    req.user = decoded;

    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// --------------------------------------------------
// AUTHORIZATION MIDDLEWARE (Role-based Access)
// --------------------------------------------------
export const permit = (...allowedRoles: AuthPayload["role"][]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permission" });
    }

    return next();
  };
};

// --------------------------------------------------
// SHORTCUTS (Optional)
// --------------------------------------------------
export const superUserOnly = permit("SUPERUSER");
export const staffOnly = permit("STAFF", "SUPERUSER");
