import express from "express";
import type {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import helmet from "helmet";
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

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts, please try again later." },
});
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    });
  }
);

export default app;
