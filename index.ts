import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma-config";


// Import routes
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import departmentRoutes from "./routes/department";
import studentRoutes from "./routes/student";
import teacherRoutes from "./routes/teacher";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API Test Route
app.get("/", (_req: Request, res: Response) => {
  res.send("🎓 College Management System API Running Successfully!");
});

// Register all routes
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/departments", departmentRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// Start server + check Prisma connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log("🟢 Prisma connected to MongoDB Atlas!");

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("🔴 Failed to connect to the database:", err);
    process.exit(1);
  }
}

startServer();
