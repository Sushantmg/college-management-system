import express from "express";
import type {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";

dotenv.config();

// Create app
const app: Application = express();

// ------------------------------------
// MIDDLEWARE
// ------------------------------------

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ------------------------------------
// TEST ROUTE
// ------------------------------------

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "🎓 College Management System API Running Successfully!"
  );
});

// ------------------------------------
// API ROUTES
// ------------------------------------

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/departments", departmentRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);

// ------------------------------------
// 404 HANDLER
// ------------------------------------

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ------------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------------

app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
);

export default app;