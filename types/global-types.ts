import { Request } from "express";

export interface AuthPayload {
  userId: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: AuthPayload;
}
