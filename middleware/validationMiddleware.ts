import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { RequestWithUser } from "../types/global-types";

// -------------------------
// Generic Validation Middleware
// -------------------------
// Works with Request or RequestWithUser
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: (Request | RequestWithUser) & { body: T }, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // req.body is typed as T
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      return res.status(400).json({ error: "Invalid request body" });
    }
  };
