import { Request } from "express";

export interface AuthPayload {
  userId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "SUPERUSER";
}

export interface RequestWithUser extends Request {
  user?: AuthPayload;
}
