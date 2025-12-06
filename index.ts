import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import studentsRoutes from "./routes/students";
import teachersRoutes from "./routes/teachers";
import coursesRoutes from "./routes/courses";
import departmentsRoutes from "./routes/departments";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3005);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// mount routes (HamroMart style)
app.use("/auth", authRoutes);
app.use("/students", studentsRoutes);
app.use("/teachers", teachersRoutes);
app.use("/courses", coursesRoutes);
app.use("/departments", departmentsRoutes);

app.get("/", (_req, res) => res.send("🚀 College API (HamroMart-style) running"));

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
