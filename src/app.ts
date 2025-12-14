import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes (all imports without .ts extensions for consistency)
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import departmentRoutes from "./routes/department";
import studentRoutes from "./routes/student";
import teacherRoutes from "./routes/teacher";

dotenv.config();

// Create app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Test route
app.get("/", (_req: Request, res: Response) => {
  res.send("🎓 College Management System API Running Successfully!");
});

// Register routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/departments", departmentRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

export default app;
