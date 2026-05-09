import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  RequestWithUser,
  AuthPayload,
} from "../types/global-types.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing");
}

// ------------------------------------
// AUTH MIDDLEWARE
// ------------------------------------

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as AuthPayload;

    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

// ------------------------------------
// ROLE AUTHORIZATION
// ------------------------------------

export const permit = (
  ...allowedRoles: AuthPayload["role"][]
) => {
  return (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  };
};

// ------------------------------------
// SHORTCUTS
// ------------------------------------

export const superUserOnly = permit("SUPERUSER");

export const staffOnly = permit(
  "STAFF",
  "SUPERUSER"
);