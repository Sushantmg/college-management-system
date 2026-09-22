import express from "express";
import type {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { getErrorMessage } from "./utils/errors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import departmentRoutes from "./routes/department.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import statsRoutes from "./routes/stats.routes";

dotenv.config();

const app: Application = express();

// Render (and similar platforms) run behind a proxy that sets X-Forwarded-For.
// Trusting it keeps express-rate-limit from throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// All API routes live under these prefixes
const apiPaths = [
  "/auth",
  "/courses",
  "/departments",
  "/students",
  "/teachers",
  "/enrollments",
  "/stats",
];

// Rate limiting (applies to every API route)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiPaths, limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts, please try again later." },
});
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

// Don't let browsers cache authenticated API responses
app.use(apiPaths, (_req: Request, res: Response, next: NextFunction) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// CORS — allow a comma-separated list of origins from CORS_ORIGIN
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:4000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "College Management System API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

// API routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/departments", departmentRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/stats", statsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const error = err as { type?: string; status?: number; message?: string };

    // Malformed JSON bodies should be a 400, not a 500
    if (err && (error.type === "entity.parse.failed" || error.status === 400)) {
      return res.status(400).json({
        error: "Invalid request body",
      });
    }

    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : getErrorMessage(err),
    });
  }
);

export default app;
