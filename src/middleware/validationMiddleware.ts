import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { RequestWithUser } from "../types/global-types";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: RequestWithUser & { body: unknown }, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.issues,
        });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
