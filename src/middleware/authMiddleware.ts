import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import {
  RequestWithUser,
  AuthPayload,
} from "../types/global-types";

const VALID_ROLES: AuthPayload["role"][] = [
  "ADMIN",
  "TEACHER",
  "STUDENT",
  "STAFF",
  "SUPERUSER",
];

const TOKEN_EXPIRED = "TokenExpiredError";

function isTokenExpiredError(err: unknown): boolean {
  return err instanceof Error && err.name === TOKEN_EXPIRED;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

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
      getJwtSecret()
    ) as AuthPayload;

    if (
      typeof decoded?.userId !== "string" ||
      typeof decoded?.role !== "string" ||
      !VALID_ROLES.includes(decoded.role as AuthPayload["role"])
    ) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    if (isTokenExpiredError(error)) {
      return res.status(401).json({
        error: "Token expired",
      });
    }

    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

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

export const superUserOnly = permit("SUPERUSER");
export const staffOnly = permit("STAFF", "SUPERUSER");
