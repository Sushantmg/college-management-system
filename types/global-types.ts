import { Request } from "express";

// -------------------------
// JWT Payload Type
// -------------------------
export interface AuthPayload {
  userId: string;
  role: "USER" | "STAFF" | "SUPERUSER";
}

// -------------------------
// Extend Express Request
// -------------------------
export interface RequestWithUser extends Request {
  user?: AuthPayload;
}
