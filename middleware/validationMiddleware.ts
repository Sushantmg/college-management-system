import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { RequestWithUser } from "../types/global-types";

// --------------------------------------------------
// Generic Zod Validation Middleware
// --------------------------------------------------
export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: RequestWithUser & { body: unknown }, res: Response, next: NextFunction) => {
    try {
      // Safely parse body→ returns typed T
      const parsed = schema.parse(req.body);
      req.body = parsed; // ✔ now body is type-safe everywhere
      return next();
    } catch (err) {
     if (err instanceof ZodError) {
  return res.status(400).json({
    error: "Validation failed",
    details: err.issues, // <-- use .issues
  });
     }}}
